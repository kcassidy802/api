$(document).ready(function () {
    // Fetch and display contacts on page load
    fetchContacts();

    // Handle form submission to add new contact
    $("#addContactForm").submit(function (event) {
        event.preventDefault();
        addContact();
    });

    // Function to fetch contacts from the API
    function fetchContacts() {
        $.get("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts", function (data) {
            displayContacts(data);
        });
    }

    // Function to display contacts in the table
    function displayContacts(contacts) {
        var tableBody = $("#contactList");
        tableBody.empty();

        contacts.forEach(function (contact) {
            var row = "<tr>" +
                "<td>" + contact.name + "</td>" +
                "<td>" + contact.email + "</td>" +
                "<td>" + (contact.phone || "N/A") + "</td>" +
                "<td>" +
                "<button class='btn btn-warning btn-sm' onclick='editContact(" + contact.id + ")'>Edit</button> " +
                "<button class='btn btn-danger btn-sm' onclick='deleteContact(" + contact.id + ")'>Delete</button>" +
                "</td>" +
                "</tr>";

            tableBody.append(row);
        });
    }

    // Function to add a new contact
    window.addContact = function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();

        $.post("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts", { name: name, email: email, phone: phone }, function () {
            $("#addContactModal").modal("hide");
            fetchContacts();
        });
    }

    // Function to delete a contact
    window.deleteContact = function (id) {
        $.ajax({
            url: "https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts/" + id,
            type: "DELETE",
            success: function () {
                fetchContacts();
            },
            error: function (xhr, status, error) {
                console.error("Error deleting contact:", error);
            }
        });
    };

    // Function to edit a contact
    window.editContact = function () {
        // Assuming you have a modal with id="editContactModal"
        var modal = $("#editContactModal");

        // Fetch the contact details for the given ID
        fetch("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts/" + id)
            .then(response => response.json())
            .then(contact => {
                // Populate the modal form with existing contact details
                modal.find("#editName").val(contact.name);
                modal.find("#editEmail").val(contact.email);
                modal.find("#editPhone").val(contact.phone || "");

                // Show the modal
                modal.modal("show");
            })
            .catch(error => {
                console.error("Error fetching contact details for editing:", error);
            });
    };

    // Function to update a contact
    window.updateContact = function () {
        var modal = $("#editContactModal");

        var updatedName = modal.find("#editName").val();
        var updatedEmail = modal.find("#editEmail").val();
        var updatedPhone = modal.find("#editPhone").val();

        // Prepare the updated data
        var updatedData = {
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone
        };

        // Make a PUT or PATCH request to update the contact on the server
        fetch("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts/" + id, {
            method: "PUT", // or "PATCH" depending on your API's requirements
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error updating contact: ${response.statusText}`);
            }
            return response.json(); // assuming your API returns JSON
        })
        .then(() => {
            // Hide the modal after successful update
            modal.modal("hide");
            // Fetch and display the updated list of contacts
            fetchContacts();
        })
        .catch(error => {
            console.error("Error updating contact:", error);
        });
    };
});
