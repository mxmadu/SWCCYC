window.onload = function () {
    // Show the modal and the overlay when the page loads
    document.getElementById('welcomeModal').style.display = "block";
    document.getElementById('overlay').style.display = "block";

    // Hide the modal and the overlay when the begin button is clicked
    document.getElementById('begin-btn').onclick = function () {
        document.getElementById('welcomeModal').style.display = "none";
        document.getElementById('overlay').style.display = "none";
    };
};

function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
  }

