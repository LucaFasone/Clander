![image](https://github.com/user-attachments/assets/cf2f75d5-5e2d-46e3-81f8-2c17f3a71125)

# Clander

Welcome to **Clander**, an application designed for creating and sharing events among users in real-time. Users can be invited to events and are granted specific permissions assigned by the event creator.

## Key Features

- **Real-Time Event Updates**: All event details are synchronized in real-time, ensuring that participants always have the latest information. Thanks to Tanstack and WebSocket.
- **Invitation-Based Participation**: Users are invited to events, and based on their assigned permissions, they can:
    - **View**: Access and see all event details.
    - **Edit**: Modify event details, such as the title, description, time, and location.
    - **Share**: Re-share the event with other users, extending participation to more people.
- **Date Range Events**: Events can span multiple days, allowing users to create and manage events with start and end dates.
- **Permission Management**: The event creator has full control over who can view, edit, or share the event, ensuring that event management remains organized and secure.
- **User Notifications**: Notifications are sent in real-time when users are invited to events or when event details change.

## Technologies Used
- **Frontend**: [React](https://reactjs.org/) – A JavaScript library for building user interfaces based on components.
- **Backend**: [Hono.js](https://hono.dev/) – A fast, lightweight web framework for building APIs (I think **Express** would have been easier to work with).
- **Database**: [MySQL](https://www.mysql.com/it/) – A reliable relational database for storing event and user information.
- **Caching & Real-Time Data**: [TanStack Query](https://tanstack.com/query/latest) – Provides efficient data fetching, caching, and synchronization for real-time updates.
- **Authentication**: Currently, I am using **Kinde** for user authentication. However, the experience with Kinde has been kinda rough. Its limited flexibility makes it difficult to customize according to the app’s needs.

## Hosting & Deployment

WIP – Currently working on deployment. A 404 page will be implemented as soon as the app is deployed.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve the app.

