# Project Management Tool (PMT)

The Project Management Tool is a web-based application. It provides a comprehensive solution for managing projects, tasks, and collaboration within teams. The application leverages various technologies to ensure a seamless user experience and efficient project management.

## Technologies Used

The Project Management Tool incorporates the following technologies and frameworks:

- **Backend Development**: The server-side of the application is built using Express.js, a fast and minimalist web framework for Node.js. Express.js enables efficient routing, request handling, and data management.

- **Frontend Development**: The user interface is developed using React, a popular JavaScript library for building dynamic and interactive user interfaces. React allows for modular component-based development and enhances the performance of the application.

- **Database Management**: The application utilizes PostgreSQL, a powerful and open-source relational database. PostgreSQL offers robust data storage, retrieval, and management capabilities, ensuring efficient handling of project-related information.

- **Containerization**: Docker is used to containerize the application, making it easier to manage dependencies, improve scalability, and ensure consistent deployment across different environments.

- **Real-time Communication**: Socket.IO is employed to facilitate real-time bidirectional communication between the client and server. It enables features like real-time chat, task updates, and notifications, enhancing collaboration and productivity.

- **Additional Libraries and Tools**: Bcrypt is used for password hashing, ensuring secure storage of user credentials. Nodemailer is utilized for email functionality, enabling features such as email verification and password reset.

## Features

The Project Management Tool offers a range of features to streamline project management and enhance collaboration:

- User registration and authentication
- Email verification to ensure secure user access
- Password reset functionality for users who forget their passwords
- Project creation, allowing users to define project details and objectives
- Member invitation to collaborate on projects, ensuring seamless teamwork
- Task creation and assignment to track progress and allocate responsibilities
- Reviewer assignment for tasks requiring quality assurance and review
- Task status tracking with labels such as "New Request," "In Progress," "On Review," and "Complete"
- Task comments for effective communication and feedback between team members
- Project star functionality to mark important projects for quick access
- Sorting projects by the last changed date, aiding in project prioritization
- Real-time chat functionality within task comments, promoting instant communication
- Notifications to keep users informed about updates, comments, and mentions

## Installation and Usage

To run the Project Management Tool locally, follow these steps:

1. Clone the repository: `git clone [repository URL]`
2. Install server dependencies: `cd server && docker build .`
3. Install client dependencies: `cd client && docker build .`
4. Configure the PostgreSQL database and update the connection settings.
5. create database tables (you can find script in `/server/src/scripts/ddl.sql`)
6. Start the server: `docker-compose up --build`

Ensure that you set the necessary environment variables, such as database connection details and email server credentials, before running the application.
