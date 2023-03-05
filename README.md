# ThoughtsUp

ThoughtsUp is a social network API built using Express.js and MongoDB, which can handle large amounts of unstructured data. It offers a variety of features such as sharing thoughts, reacting to friend’s thoughts, and creating a friend list. It’s a great solution for social media startups as it offers flexibility in terms of data structure and handles large amounts of data effectively. It also offers API GET, POST, PUT, and DELETE routes to enable users to interact with the database, and the Mongoose ODM is used for database modeling. ThoughtsUp is perfect for developers looking to build social network APIs and require scalability and flexibility in their data structure.

## User Story

```md
AS A social media startup
I WANT an API for my social network that uses a NoSQL database
SO THAT my website can handle large amounts of unstructured data
```

## Acceptance Criteria

```md
GIVEN a social network API
WHEN I enter the command to invoke the application
THEN my server is started and the Mongoose models are synced to the MongoDB database
WHEN I open API GET routes in Insomnia for users and thoughts
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete users and thoughts in my database
WHEN I test API POST and DELETE routes in Insomnia
THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
```

## Installation

To install and run on your local machine, follow these steps:

**Clone this repository to your local machine**

`git clone <'REPOURL'>`

**Install the necessary dependencies**

`npm init -y`

`npm i express`

`npm i mongoose`

**Seed The Database**

`npm run seed`

**Run the Application**

`node server`

## Demo

### GET ALL Routes - Users / Thoughts
![GET ALL Routes - Users/Thoughts](https://github.com/jbxamora/ThoughtsUp/blob/main/assets/GETALLROUTES-18.gif)
### GET ONE Routes - Users / Thoughts
![GET ONE Routes -Users/Thoughts](https://github.com/jbxamora/ThoughtsUp/blob/main/assets/GETONEROUTES-18.gif)
### POST, PUT, DELETE Routes - Thoughts


https://user-images.githubusercontent.com/113067058/222951149-d9bc38a3-f2fd-43b2-88c8-6284ad1409df.mov


### POST, PUT, DELETE Routes - User
![POST, PUT, DELETE Routes - User](https://github.com/jbxamora/ThoughtsUp/blob/main/assets/PPDROUTES-18.gif)
### POST/DELETE Routes - Friends
![POST/DELETE Routes - Friends](https://github.com/jbxamora/ThoughtsUp/blob/main/assets/PDFRIENDROUTES-18.gif)
### POST/DELETE Routes - Reactions


https://user-images.githubusercontent.com/113067058/222951154-bfb5239a-3a7e-4b74-bd50-54380fa4fa35.mov


## Code Snippets

### Date Formatting

This code exports a function that takes in a timestamp and an options object with properties monthLength and dateSuffix.
The function formats the timestamp into a readable string format using the options provided.

If the monthLength is set to `short`, the abbreviated month name is used in the format, otherwise the full month name is used.

If `dateSuffix` is true, the day of the month is appended with a suffix like `st`, `nd`, `rd`, or `th`.

The function first creates an object of month names based on the `monthLength` option provided, then creates a new `Date` object from the timestamp, and finally formats the date into a string using string concatenation.

```js
// Function to format a timestamp
module.exports = (
  timestamp,
  { monthLength = "short", dateSuffix = true } = {}
) => {
  let months;

  if (monthLength === "short") {
    months = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };
  } else {
    months = {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };
  }

  const dateObj = new Date(timestamp);
  const formattedMonth = months[dateObj.getMonth()];

  let dayOfMonth;

  if (dateSuffix) {
    dayOfMonth = addDateSuffix(dateObj.getDate());
  } else {
    dayOfMonth = dateObj.getDate();
  }

  const year = dateObj.getFullYear();

  let hour;
  // Check for 24-hr time
  if (dateObj.getHours > 12) {
    hour = Math.floor(dateObj.getHours() / 2);
  } else {
    hour = dateObj.getHours();
  }
  // If hour is 0 (12:00am), change it to 12
  if (hour === 0) {
    hour = 12;
  }

  const minutes = dateObj.getMinutes();

  // Set `am` or `pm`
  let periodOfDay;

  if (dateObj.getHours() >= 12) {
    periodOfDay = "pm";
  } else {
    periodOfDay = "am";
  }

  const formattedTimeStamp = `${formattedMonth} ${dayOfMonth}, ${year} at ${hour}:${minutes} ${periodOfDay}`;

  return formattedTimeStamp;
};
```

### Seeds

This is an asynchronous function in JavaScript that is responsible for seeding the MongoDB database with data.

The function first removes any existing data for the `Thoughts` and `User` models using the Mongoose's `deleteMany()` method.
It then creates new data for these models using the Mongoose's `create()` method with the data defined in the thoughts and users arrays.

After creating the new data, the function associates the thoughts with the users by iterating through the `createdThoughts` array and finding the user with the matching username.

It pushes the `thought._id` into the user's thoughts array and saves the user. Finally, the function logs a success message to the console and disconnects from the database.

```js
const seedData = async () => {
  try {
    // Remove any existing data
    await Thought.deleteMany({});
    await User.deleteMany({});

    // Create the new data
    const createdUsers = await User.create(users);
    const createdThoughts = await Thought.create(thoughts);

    // Associate the thoughts with the users
    for (let i = 0; i < createdThoughts.length; i++) {
      const thought = createdThoughts[i];
      const user = createdUsers.find(
        (user) => user.username === thought.username
      );
      user.thoughts.push(thought._id);
      await user.save();
    }

    console.log("Data seeding successful!");
  } catch (error) {
    console.error("Error seeding data:", error.message);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
};
```

## License

MIT License

Copyright (c) [2022] [Jorge Zamora]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Badges

<a href=”https://www.linkedin.com/in/jorge-zamora-786945250/”>
<img src='https://img.shields.io/badge/LinkedIn-blue?style=flat&logo=linkedin&labelColor=blue'>

![badmath](https://img.shields.io/github/followers/jbxamora?label=JBXAMORA&logoColor=%23fd2423&style=social)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. If the issue goes unresolved for more than a week feel free to contact me at any of the links listed below. Be sure to add me on LinkedIn and Follow me on GitHub to view my course progression.

[<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/github.svg' alt='github' height='40'>](https://github.com/jbxamora) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/linkedin.svg' alt='linkedin' height='40'>](https://www.linkedin.com/in/jorge-zamora-786945250//) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/instagram.svg' alt='instagram' height='40'>](https://www.instagram.com/jbxamora/) [<img src='https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/stackoverflow.svg' alt='stackoverflow' height='40'>](https://stackoverflow.com/users/20023706/jbxamora)
