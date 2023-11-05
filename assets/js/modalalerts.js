// Modal Alert is referred based Bulma CSS from the given link https://bulma.io/documentation/components/modal/
// Function for closing the modal
document.addEventListener('DOMContentLoaded', () => {
    
     (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
          const $target = $close.closest('.modal');

          $close.addEventListener('click', () => {
               closeModal($target);
          });
     });

     document.addEventListener('keydown', (event) => {
          if (event.code === 'Escape') {
                    closeAllModals();
          }
     });
}); 