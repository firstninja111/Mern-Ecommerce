
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/renestlaurent/Prototype-2/">
    <img src="Client/src/images/Choiredex.png" alt="Logo" width="350" />
  </a>

  <h3 align="center">CHOIREDEX - Appointment Booking Application</h3>

  <p align="center">
    MERN stack appointment scheduling and employee/client management application
    <br />
    <br />
    <a href="https://demo02.choiredex.com/">View Demo</a>
    ·
    <a href="https://github.com/renestlaurent/Prototype-2/issues">Report Issue</a> 
  </p>
</p>


## Background

Choiredex allows retailers to orchestrate their omnichannel customer journeys from their online channels to their stores. Store teams and online customers can now engage together in journeys on which retailers have control. By increasing the number of scheduled store visits and qualified customers, Choiredex allows retailers to distribute better and shorten every interaction between a customer and an associate. Omnichannel customers living a scored retail experience obtain the services and the products they need effortlessly. They are more satisfied and are more likely to purchase and repurchase. With Choiredex, customers and store teams coordinate their activities from the same choral retail score sheet.


## Functionality

<p align="center">
<a href="https://demo02.choiredex.com/">
    <img  src="Client/src/images/Login_Screenshot.png" alt="Choiredex Appointment Admin Panel Screenshot" />
</a>
</span>
<br />
<br />


This is a MERN (MongoDB, Express, React, Node.js) stack application that uses [Redux](https://github.com/reduxjs/redux) for state management and [Apollo Client](https://www.npmjs.com/package/apollo-boost) to fetch data from a MongoDB database via [GraphQL](https://graphql.org/). It has some of the following features:

<strong>Responsive design, SEO, and performance optimizations by means of:</strong>
* Custom, effective meta tags with [metatags.io](https://metatags.io/) and favicons with [favicon.io](https://favicon.io/).
* SVG compression using [SVGOMG](https://jakearchibald.github.io/svgomg/), static site image compression using [Squoosh](https://squoosh.app/), and user-uploaded image compression using [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) and [LZString](https://github.com/pieroxy/lz-string)).
* Lazy loading and SVG stroke-dashoffset animation triggers and animation on landing page with the [Intersection Observer API](https://www.npmjs.com/package/react-intersection-observer) and [react-spring](https://www.npmjs.com/package/react-spring).
* [Code-splitting](https://reactjs.org/docs/code-splitting.html) along shopping cart routes and authenticated user routes.

<strong>Guest clients are able to:</strong>
* Guest clients can meet an agent or purchase and obtain advice in a store.
* Select the service that they want to receive and choose one of the most comfortable store.
* Choose an available date and time for their appointment.
* Fill out contact information and any appointment notes.
* Finally book an appointment regarding to information.

<strong>Authenticated clients are able to do all of the above, as well as:</strong>
* See upcoming and past appointments.
* Cancel an upcoming appointment.

<strong>Authenticated concierge and agent members are able to:</strong>
* Receive real-time relevant activity updates such as new bookings or cancellations in their employee dashboard via GraphQL [subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/) powered by [Google Cloud Pub/Sub](https://cloud.google.com/pubsub/docs/overview).
* View all clients members and each individual's upcoming and past appointments.
* Update client and their own profile photos by uploading a photo or taking a photo with a [webcam](https://github.com/MABelanger/react-html5-camera-photo).
* Add, delete, or update appointments and personal events in their own calendar.

<strong>Authenticated staff members with "admin" status are also able to:</strong>
* Add new staff members.
* Delete clients and staff members.
* Update all clients' and staff members' profile photos.
* View and manage all staff members' calendars.

## Local Development

To develop this project locally, follow the steps below.

### Prerequisites

You will need to have the following software installed:
* npm
* Git
* Node.js

### Installation

1. Clone the Github repository.
    ```sh
    git clone https://github.com/renestlaurent/Prototype-2
    ```
2. Install all server-side NPM packages.
    ```sh
    cd ..
    npm install
    ```
3. Install all client-side NPM packages.
    ```sh
    cd Client
    npm install
    ```
4. Start Server Application
    ```sh
    npm run start
    ```    
5. Start Client Application
    ```sh
    cd Client
    npm run start
    ```
6. Build for production.
    ```sh
    npm run build
    ```

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Choiredex Software Ltd - rpstlaurent@choiredex.com

Project Link: [https://github.com/renestlaurent/Prototype-2](https://github.com/renestlaurent/Prototype-2)
