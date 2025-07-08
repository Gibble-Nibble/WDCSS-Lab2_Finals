# Google Sheets Integration Setup Guide

## Step 1: Create a Google Sheet

1. Open [Google Sheets](https://sheets.google.com) and create a new blank sheet
2. Rename it (e.g., "Contact Form Submissions")
3. In Row 1, enter the following headers:
   - **A1**: Name
   - **B1**: Email
   - **C1**: Phone
   - **D1**: Subject
   - **E1**: Message
   - **F1**: Timestamp

## Step 2: Create Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete the default `myFunction()` code
3. Replace it with the following code:

```javascript
function doPost(e) {
  try {
    console.log("Full event object:", e);
    console.log("Event parameters:", e.parameter);
    console.log("Post data:", e.postData);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data;
    
    // Handle different ways data might come in
    if (e.postData && e.postData.contents) {
      // Data from JSON POST request
      console.log("Parsing JSON data:", e.postData.contents);
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // Data from form POST or URL parameters
      console.log("Using parameter data:", e.parameter);
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }
    
    console.log("Processed data:", data);
    
    // Add the data to the sheet
    sheet.appendRow([
      data.name || '',
      data.email || '',
      data.phone || '',
      data.subject || '',
      data.message || '',
      data.timestamp || new Date().toLocaleString()
    ]);
    
    console.log("Data successfully added to sheet");
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ result: "success", message: "Data saved successfully" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error("Error in doPost:", error.toString());
    console.error("Full error:", error);
    
    // Still try to log what we received for debugging
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow([
        "ERROR: " + new Date().toLocaleString(),
        error.toString(),
        JSON.stringify(e.postData || {}),
        JSON.stringify(e.parameter || {}),
        "Debug row",
        new Date().toLocaleString()
      ]);
    } catch (debugError) {
      console.error("Could not write debug info:", debugError);
    }
    
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function that mimics the actual web request
function testWebRequest() {
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Web Test User",
        email: "webtest@example.com",
        phone: "09123456789",
        subject: "Web Test Subject",
        message: "Test message from web simulation",
        timestamp: new Date().toLocaleString()
      }),
      type: "application/json"
    }
  };
  
  var result = doPost(testEvent);
  console.log("Web test result:", result.getContent());
}

// Simple direct test
function testDirectWrite() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    "Direct Test " + new Date().getTime(),
    "direct@test.com",
    "09123456789",
    "Direct Subject",
    "Direct message",
    new Date().toLocaleString()
  ]);
  console.log("Direct test completed");
}
```

4. Click **Save** (Ctrl+S)
5. Give your project a name (e.g., "Contact Form Handler")

## Step 3: Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: Contact Form Handler
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Grant permissions** when prompted:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** if you see a warning
   - Click **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 4: Update Your Contact Form

1. Open `contact.js` file
2. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL";
   ```
3. Replace `"YOUR_GOOGLE_APPS_SCRIPT_URL"` with your actual Web App URL from Step 3

Example:
```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz.../exec";
```

## Step 5: Test Your Form

1. Open your contact page in a browser
2. Fill out the form with test data
3. Click "Send Message"
4. Check your Google Sheet to see if the data appears

## Troubleshooting

### Common Issues:

1. **"Cannot read properties of undefined (reading 'postData')" error**
   - This happens when testing the function manually
   - Use the updated `testDoPost()` function provided above
   - Make sure to pass the event parameter in the correct format

2. **"Script function not found" error**
   - Make sure you saved the Apps Script
   - Ensure the function name is `doPost`

3. **Permission errors**
   - Re-run the deployment process
   - Make sure "Who has access" is set to "Anyone"

4. **CORS errors**
   - This is normal for cross-origin requests
   - The form should still work despite console warnings

5. **Data not appearing in sheet**
   - Check that column headers match exactly
   - Verify the Web App URL is correct

### Testing the Apps Script Directly:

You can test your Apps Script by adding this test function:

```javascript
function testDoPost() {
  // Create test data in the correct format
  var testEvent = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        phone: "09123456789",
        subject: "Test Subject",
        message: "Test message",
        timestamp: new Date().toLocaleString()
      })
    }
  };
  
  // Call the doPost function with test data
  var result = doPost(testEvent);
  
  // Log the result
  console.log("Test result:", result.getContent());
  
  // Also test by directly adding data to sheet for verification
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([
    "Direct Test User",
    "directtest@example.com", 
    "09987654321",
    "Direct Test Subject",
    "Direct test message",
    new Date().toLocaleString()
  ]);
  
  console.log("Direct append test completed");
}
```

Run this function to test if your script works correctly.

## Security Notes

- The Web App URL should be kept private
- Consider adding rate limiting if you expect high traffic
- You can add additional validation in the Apps Script if needed

## Next Steps

Once everything is working:
1. Consider adding email notifications when new submissions arrive
2. Set up automatic backup of your Google Sheet
3. Add data validation rules in your Google Sheet
