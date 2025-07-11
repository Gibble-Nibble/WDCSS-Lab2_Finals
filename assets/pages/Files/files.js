// ===============================================================
// FILES PAGE - ADVANCED DRAG & DROP WITH RIPPLE EFFECT SYSTEM
// ===============================================================
// This JavaScript implements a sophisticated file manager interface with:
// 1. Material Design ripple click effects
// 2. HTML5 drag and drop API for rearranging cards
// 3. Smooth animations and transitions
// 4. Keyboard accessibility features
// 5. DOM mutation observers for dynamic content

document.addEventListener('DOMContentLoaded', function() {
    // MAIN DOM ELEMENTS: Get references to the grid container and all file cards
    const filesGrid = document.getElementById('filesGrid');
    const fileCards = document.querySelectorAll('.file-card');
    
    // INITIALIZATION: Set up all interactive features for each existing card
    // This approach allows us to easily add event listeners to new cards later
    fileCards.forEach(card => {
        setupCardEvents(card);
    });
    
    // ===============================================================
    // CARD EVENT SETUP: Attaches all interactive behaviors to a card
    // ===============================================================
    // This function is called for each card to set up:
    // - Click events with Material Design ripple effect
    // - All HTML5 drag and drop events
    // - Navigation functionality
    function setupCardEvents(card) {
        // CLICK EVENT WITH RIPPLE: Creates Material Design-style click feedback
        // The ripple effect provides visual feedback that the user has clicked
        card.addEventListener('click', function(e) {
            // CHECK IF CLICK IS ON A BUTTON: Prevent navigation if clicking buttons
            if (e.target.closest('.file-btn') || e.target.closest('button')) {
                return; // Don't navigate, let the button handle its own click
            }
            
            createRipple(e, this);  // 'this' refers to the clicked card
            
            // DELAYED NAVIGATION: Wait for ripple animation to complete
            // This creates a satisfying user experience where the visual feedback
            // finishes before the page changes
            setTimeout(() => {
                const url = this.getAttribute('data-url');
                if (url && url !== '#') {
                    window.location.href = url;
                }
            }, 300);  // 300ms matches the ripple animation duration
        });
        
        // HTML5 DRAG AND DROP EVENTS: Complete drag and drop implementation
        // These events work together to create the drag and drop functionality
        card.addEventListener('dragstart', handleDragStart);  // When dragging starts
        card.addEventListener('dragend', handleDragEnd);      // When dragging ends
        card.addEventListener('dragover', handleDragOver);    // While hovering over drop target
        card.addEventListener('drop', handleDrop);            // When dropped on target
        card.addEventListener('dragenter', handleDragEnter);  // When entering drop target
        card.addEventListener('dragleave', handleDragLeave);  // When leaving drop target
    }
    
    // ===============================================================
    // MATERIAL DESIGN RIPPLE EFFECT: Creates expanding circle animation
    // ===============================================================
    // This function creates the iconic Material Design ripple effect when cards are clicked
    // The ripple starts from where the user clicked and expands outward
    function createRipple(event, element) {
        // CALCULATE RIPPLE POSITION: Get exact click coordinates relative to the card
        const rect = element.getBoundingClientRect();  // Get card's position and size
        const size = Math.max(rect.width, rect.height);  // Make ripple cover entire card
        
        // CLICK COORDINATES: Calculate where the user clicked relative to the card
        // We subtract half the size to center the ripple on the click point
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // CREATE RIPPLE ELEMENT: Build the expanding circle DOM element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');  // CSS class handles the animation
        
        // POSITION AND SIZE: Set the ripple's initial state
        ripple.style.width = ripple.style.height = size + 'px';  // Perfect circle
        ripple.style.left = x + 'px';    // Horizontal position from click point
        ripple.style.top = y + 'px';     // Vertical position from click point
        
        // ADD TO DOM: Insert the ripple into the clicked card
        element.appendChild(ripple);
        
        // CLEANUP: Remove the ripple element after animation completes
        // This prevents memory leaks and keeps the DOM clean
        setTimeout(() => {
            if (ripple.parentNode) {  // Safety check in case element was removed
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);  // 600ms gives enough time for the full animation
    }
    
    // ===============================================================
    // DRAG AND DROP STATE MANAGEMENT: Track dragging operations
    // ===============================================================
    // These variables keep track of the current drag operation
    let draggedElement = null;  // The card currently being dragged
    let draggedOver = null;     // The card currently being hovered over during drag

    // ===============================================================
    // DRAG START HANDLER: Initiates the drag operation
    // ===============================================================
    // Called when user starts dragging a card (mouse down + movement)
    function handleDragStart(e) {
        draggedElement = this;  // Store reference to the card being dragged
        
        // VISUAL FEEDBACK: Add CSS classes to show dragging state
        this.classList.add('dragging');        // Style the card being dragged
        filesGrid.classList.add('drag-active'); // Style the entire grid during drag
        
        // HTML5 DRAG DATA: Configure the drag operation
        e.dataTransfer.effectAllowed = 'move';  // Indicate this is a move operation
        e.dataTransfer.setData('text/html', this.outerHTML);  // Store card HTML for fallback
    }
    
    // ===============================================================
    // DRAG END HANDLER: Cleans up after drag operation completes
    // ===============================================================
    // Called when user releases the mouse button (whether dropped successfully or not)
    function handleDragEnd(e) {
        // REMOVE VISUAL FEEDBACK: Clean up all drag-related styling
        this.classList.remove('dragging');        // Remove drag styling from dragged card
        filesGrid.classList.remove('drag-active'); // Remove drag styling from grid
        
        // CLEANUP HOVER STATES: Remove drag-over styling from all cards
        // This is necessary because dragleave might not fire on all cards
        fileCards.forEach(card => {
            card.classList.remove('drag-over');
        });
        
        // RESET STATE VARIABLES: Clear references for next drag operation
        draggedElement = null;
        draggedOver = null;
    }
    
    // ===============================================================
    // DRAG OVER HANDLER: Manages dragging over potential drop targets
    // ===============================================================
    // Called continuously while dragging over an element
    // Must preventDefault() to allow dropping
    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();  // CRITICAL: Allow dropping by preventing default behavior
        }
        
        // SET DROP EFFECT: Visual indicator for user about what will happen
        e.dataTransfer.dropEffect = 'move';  // Show "move" cursor/icon
        return false;  // Additional prevention of default behavior
    }

    // ===============================================================
    // DRAG ENTER HANDLER: Visual feedback when entering a drop target
    // ===============================================================
    // Called when dragged element first enters a potential drop target
    function handleDragEnter(e) {
        // PREVENT SELF-DROP: Don't highlight the card being dragged
        if (this !== draggedElement) {
            this.classList.add('drag-over');  // Add hover styling
            draggedOver = this;               // Track current hover target
        }
    }

    // ===============================================================
    // DRAG LEAVE HANDLER: Remove visual feedback when leaving drop target
    // ===============================================================
    // Called when dragged element leaves a potential drop target
    function handleDragLeave(e) {
        this.classList.remove('drag-over');  // Remove hover styling
    }
    
    // ===============================================================
    // DROP HANDLER: The complex logic for swapping card positions
    // ===============================================================
    // Called when user drops a dragged element onto this drop target
    // This is where the actual card rearrangement happens
    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();  // Prevent event bubbling to parent elements
        }
        
        // VALIDATE DROP: Only proceed if we have valid elements to swap
        if (draggedElement !== this && draggedElement !== null) {
            // STORE CURRENT POSITIONS: We need to remember where things are before moving them
            // The DOM insertion methods change these relationships, so we capture them first
            const draggedNextSibling = draggedElement.nextSibling;  // What comes after dragged element
            const draggedParent = draggedElement.parentNode;        // Container of dragged element
            const droppedNextSibling = this.nextSibling;            // What comes after drop target
            const droppedParent = this.parentNode;                  // Container of drop target
            
            // PERFORM THE SWAP: Move elements to their new positions
            // Step 1: Move dragged element to where drop target was
            droppedParent.insertBefore(draggedElement, droppedNextSibling);
            
            // Step 2: Move drop target to where dragged element was
            draggedParent.insertBefore(this, draggedNextSibling);
            
            // REATTACH EVENTS: The DOM manipulation might affect event listeners
            // Reattach all events to ensure functionality continues working
            setupCardEvents(draggedElement);  // Reattach to the element that was dragged
            setupCardEvents(this);           // Reattach to the element that was dropped on
        }
        
        // CLEANUP: Remove visual feedback
        this.classList.remove('drag-over');
        return false;  // Prevent default drop behavior
    }
    
    // ===============================================================
    // ACCESSIBILITY ENHANCEMENT: Keyboard navigation support
    // ===============================================================
    // Makes the drag and drop interface accessible to users who can't use a mouse
    // This ensures the interface works with screen readers and keyboard navigation
    fileCards.forEach((card, index) => {
        // FOCUSABLE: Make cards focusable with Tab key
        card.setAttribute('tabindex', '0');
        
        // SCREEN READER SUPPORT: Provide descriptive labels for assistive technology
        card.setAttribute('aria-label', `File card ${index + 1}. Press space to select, arrow keys to move.`);
        
        // KEYBOARD INTERACTION: Allow activation with Enter or Space
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {  // Space or Enter key
                e.preventDefault();  // Prevent page scrolling on space
                this.click();       // Trigger the same action as clicking
            }
        });
    });
    
    // ===============================================================
    // DYNAMIC CONTENT OBSERVER: Handles newly added cards with smooth animations
    // ===============================================================
    // This uses the MutationObserver API to watch for DOM changes
    // When new cards are added to the grid, they'll automatically get entrance animations
    const observer = new MutationObserver(function(mutations) {
        // PROCESS EACH CHANGE: Loop through all DOM modifications
        mutations.forEach(function(mutation) {
            // CHECK FOR NEW ELEMENTS: Only interested in added nodes
            if (mutation.type === 'childList') {
                // ANIMATE NEW CARDS: Apply entrance animation to each new card
                mutation.addedNodes.forEach(function(node) {
                    // VERIFY IT'S A CARD: Make sure the added element is actually a file card
                    if (node.classList && node.classList.contains('file-card')) {
                        // INITIAL STATE: Start invisible and scaled down
                        node.style.opacity = '0';
                        node.style.transform = 'scale(0.8)';
                        
                        // ENTRANCE ANIMATION: Fade in and scale up after a brief delay
                        setTimeout(() => {
                            node.style.transition = 'all 0.3s ease';  // Smooth transition
                            node.style.opacity = '1';                 // Fade in
                            node.style.transform = 'scale(1)';        // Scale to normal size
                        }, 50);  // 50ms delay prevents animation glitches
                    }
                });
            }
        });
    });
    
    // START OBSERVING: Watch the files grid for any child element changes
    // childList: true means we want to know when child elements are added/removed
    observer.observe(filesGrid, { childList: true });
    
    // DOWNLOAD BUTTON CLICK HANDLER: Show modal instead of downloading
    // Add event listeners to all download buttons to show the modal
    document.addEventListener('click', function(e) {
        if (e.target.closest('.file-btn-secondary')) {
            e.preventDefault();
            e.stopPropagation();
            
            // Show the download not available modal
            const downloadModal = new bootstrap.Modal(document.getElementById('downloadModal'));
            downloadModal.show();
        }
    });
});
