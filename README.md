# Grubdash Server
### There is a company called Grubdash. They have a website where people can order food from local restaurants for delivery.
### This server provides backend support for their service, tracking order submissions and statuses.

## Tools and Dependencies
This project relies on the following key tools and libraries:
  - Node.js: node forms the basis of the application helping to manage packages and scripts
  - Express.js: the server instance is generated by Express; additional routing functionality is also implemented using the Express library
  - Data Storage: the repo provides sample data in proper format stored locally; in the future this data will be migrated to a remote relational database

## Spinning the Server
To run this server locally, clone this repo and run the following command in the terminal: 
```bash
npm install
```
```bash
npm run start
```
Alternatively, if one wants to see changes to the local repo implemented in real-time:
```bash
npm run start:dev
```

## Routes and Request Methods
### with Expected Response
Requests may be made to the following routes with listed HTTP methods:
1. `/dishes`
  - GET 
    - Ex. Response
    ```json
    {
      data: {
        dishes: [
          // complete list of all dish objects
        ]
      }
    }
    ```
  - POST 
    - Ex. Request
    ```json
    {
      data: {
        description: //description of the dish,
        name: //Name of dish,
        price: //integer greater than 0,
        image_url: //url to image of dish
      }
    }
    ```
    - Ex. Response
     ```json
    {
      data: {
        description: //description of the dish,
        name: //Name of dish,
        price: //integer greater than 0,
        image_url: //url to image of dish,
        id: *newly assigned id property*
      }
    }
    ```

2. `/dishes/:dishId`
  - GET 
    - Ex. Response
    ```json
    {
      data: {
        description: // updated description of the dish,
        image_url: // updated url to image of dish,
        name: // original Name of dish,
        price: // original price,
        id:  // dishId
      }
    }
    ```
  - PUT
    - Ex. Request
    ```json
    {
      data: {
        description: // updated description of the dish,
        image_url: // updated url to image of dish,
        id:  //dishId
      }
    }
    ```
    - Ex. Response
     ```json
    {
      data: {
        description: // updated description of the dish,
        image_url: // updated url to image of dish,
        name: // original Name of dish,
        price: // original price,
        id:  // dishId 
      }
    }
    ```

3. `/orders`
  - GET
    - Ex. Response
    ```json
    {
      data: {
        orders: [
          // complete list of all order objects
        ]
      }
    }
    ```
  - POST
    - Ex. Request
    ```json
    {
      data: {
        deliverTo: //an address, 
        mobileNumber: //phone number, 
        dishes: [
            {
              //dish info
              quantity: //integer > 0
            }
          ]
      }
    }
    ```
    - Ex. Response
     ```json
    {
      data: {
        deliverTo: //an address, 
        mobileNumber: //phone number, 
        dishes: [
            {
              //dish info
              quantity: //integer > 0
            }
          ]
        status: *"pending"*
        id: *newly created id*
      }
    }
    ```

4. `orders/:orderId` 
  - GET 
    - Ex. Response
    ```json
    {
      data: {
        id: //orderId ,
        deliverTo: //an address, 
        mobileNumber: //phone number, 
        dishes: [
            {
              //dish info
              quantity: //integer > 0
            }
          ],
        status: //'pending' 'delivered' or 'cancelled'
      }
    }
    ```
  - PUT
    - Ex. Request
     ```json
    {
      data: {
        id: //orderId ,
        deliverTo: //updated address,
        status: // updated status
      }
    }
    ```
    - Ex. Response
     ```json
    {
      data: {
        id: //orderId ,
        deliverTo: //updated address, 
        mobileNumber: //phone number, 
        dishes: [
            {
              //dish info
              quantity: //integer > 0
            }
          ],
        status: // updated status
      }
    }
    ```
  - DELETE
    - Ex. Response: `STATUS 204`


