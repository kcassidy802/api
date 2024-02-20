$(document).ready(function () {
    // This is going to be our fetch for our contacts 
    fetchContacts();

    // This is how we add our contacts
    $("#addContactForm").submit(function (event) {
        event.preventDefault();
        addContact();
    });

    // Our function that fets contacats for our mock API
    function fetchContacts() {
        $.get("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts", function (data) {
            displayContacts(data);
        });
    }

    // Our function that will actually display the contacts in the table
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

    // The function we use to add contacts to the list
    window.addContact = function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();

        $.post("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts", { name: name, email: email, phone: phone }, function () {
            $("#addContactModal").modal("hide");
            fetchContacts();
        });
    } 

    // Our function in order to delete the contacts
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

    // Our function to edit the contact within the list
    window.editContact = function () {
        
        var modal = $("#editContactModal");

        // The fetch for contacts with their given ID
        fetch("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts/" + id)
            .then(response => response.json())
            .then(contact => {
                
                modal.find("#editName").val(contact.name);
                modal.find("#editEmail").val(contact.email);
                modal.find("#editPhone").val(contact.phone || "");

                
                modal.modal("show");
            })
            .catch(error => {
                console.error("Error fetching contact details for editing:", error);
            });
    };

    // Our function we created to update a contact
    window.updateContact = function () {
        var modal = $("#editContactModal");

        var updatedName = modal.find("#editName").val();
        var updatedEmail = modal.find("#editEmail").val();
        var updatedPhone = modal.find("#editPhone").val();

        // Showing updated Data
        var updatedData = {
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone
        };

        // Our put to the server 
        fetch("https://65b8594446324d531d561e91.mockapi.io/PromineoTechAPI/contacts/" + id, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error updating contact: ${response.statusText}`);
            }
            return response.json(); 
        })
        .then(() => {
         
            modal.modal("hide");
            //  Our Fetch to display the updated list of contacts
            fetchContacts();
        })
        .catch(error => {
            console.error("Error updating contact:", error);
        });
    };
});
