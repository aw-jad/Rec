document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startRecording");
    const stopButton = document.getElementById("stopRecording");
    const outputDiv = document.getElementById("output");
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");


    // Add event listener to the upload button
    // Inside the uploadButton event listener
    uploadButton.addEventListener("click", () => {
        const file = fileInput.files[0]; // Get the selected file

        if (file) {
            // Create FormData to send the file to the server
            const formData = new FormData();
            formData.append("file", file);

            // Send POST request to the server
            fetch("/upload-and-convert", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Handle response from server (e.g., display transcribed text)
                const transcribedText = data.transcribed_text;

                // Create a new task element with a checkbox and the transcribed text
                const taskLabel = document.createElement("label");
                const taskCheckbox = document.createElement("input");
                taskCheckbox.type = "checkbox";
                taskCheckbox.className = "task-checkbox";
            
                taskLabel.className = "task-label";
                taskLabel.appendChild(taskCheckbox);
                taskLabel.appendChild(document.createTextNode(transcribedText));
            
                // Append the new task to the current tasks section
                const currentTasksDiv = document.getElementById("currentTasks");
                currentTasksDiv.appendChild(taskLabel);
            })
            .catch(error => {
                console.error("Error:", error);
                // Handle error in the UI
            });
        }
    });


    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        stopButton.disabled = false;


        // Send a request to Flask when starting recording
        fetch("/start-recording")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => { //////////////////////
                const taskLabel = document.createElement("label");
                const taskCheckbox = document.createElement("input");
                taskCheckbox.type = "checkbox";
                taskCheckbox.className = "task-checkbox";

                // Apply the class to the label element
                taskLabel.className = "task-label";

                taskLabel.appendChild(taskCheckbox);
                taskLabel.appendChild(document.createTextNode(data.text));

                // Append the new task to the current tasks section
                const currentTasksDiv = document.getElementById("currentTasks");
                currentTasksDiv.appendChild(taskLabel);
                // Update output with converted text
                // outputDiv.textContent = data.text; 
            })
            .catch(error => {
                console.error("Error:", error);
                outputDiv.textContent = "An error occurred."; // Handle error in the UI
            });
    });

    stopButton.addEventListener("click", () => {
        startButton.disabled = false;
        stopButton.disabled = true;
    });

    function moveTask(taskElement, destination) {
        const currentTasksDiv = document.getElementById("currentTasks");
        const completedTasksDiv = document.getElementById("completedTasks");

        if (destination === "completed") {
            completedTasksDiv.appendChild(taskElement);
        } else if (destination === "current") {
            currentTasksDiv.appendChild(taskElement);
        }
    }

    // Listen for checkbox changes
    document.addEventListener("change", (event) => {
        if (event.target.type === "checkbox") {
            const taskLabel = event.target.parentNode;
            const destination = event.target.checked ? "completed" : "current";
            moveTask(taskLabel, destination);
        }
    });

});