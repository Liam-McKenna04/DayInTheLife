import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";
export default {
  DebugObjects: [
    {
      day: DateTime.utc(2022, 1, 6).toISO(),
      id: "988a0aff-3a52-431d-8ae8-feae166d0eda",
      video: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/videos/video1.mp4"),
      thumbnail: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/images/backgroundimage.png"),
      notes: [
        {
          title: "Lorem ipsum dolor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 1, 6, 10, 24).toISO(),
        },
        {
          title: "Lorem ipsum ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 1, 6, 13, 22).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 1, 7).toISO(),
      id: "9fcb954c-4e93-4f95-b7a9-6cc4be70f444",

      video: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/videos/video2.mp4"),
      thumbnail: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/images/backgroundimage.png"),
      notes: [
        {
          title: "Lorem ipsum dolor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 1, 7, 10, 24).toISO(),
        },
        {
          title: "Lorem ipsum ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 1, 7, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 1, 7, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 1, 12),
      id: "7a9baa9e-5fe5-4192-b9ee-cfad865cd2f5",

      video: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/videos/video1.mp4"),
      thumbnail: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/images/backgroundimage.png"),
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 1, 12, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 1, 12, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 1, 7, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 2, 12).toISO(),
      id: "cb133a62-0b95-4178-9c71-7f7f04f63028",

      video:
        "/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/videos/video1.mp4",
      thumbnail:
        "/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/images/2.jpg",
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 2, 12, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 2, 12, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 2, 12, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 2, 13).toISO(),
      id: "24ee7e69-0e3a-48e1-9ea4-2d3da409f6d9",

      video: "",
      thumbnail: "",
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 2, 13, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 2, 13, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 2, 13, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 2, 25).toISO(),
      id: "0e160e5a-8b36-410d-ba50-7e3103b8465f",

      video: "",
      thumbnail: "",
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 2, 25, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 2, 25, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 2, 25, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 3, 15).toISO(),
      id: "13856d2e-835c-4c1b-bf85-4a01e35756d9",

      video: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/videos/video1.mp4"),
      thumbnail: require("/home/liam/Programming/Projects/DayInTheLife/Frontend/DayInTheLife/assets/images/backgroundimage.png"),
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 3, 15, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 3, 15, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 3, 15, 13, 24).toISO(),
        },
      ],
    },

    {
      day: DateTime.utc(2022, 3, 16).toISO(),
      id: "5acee8da-991f-4112-8e8c-8bef50d7cf65",

      video: "",
      thumbnail: "",
      notes: [
        {
          title: "Lorem ipsum doasdfasdflor sit amet",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 3, 16, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 3, 16, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 3, 16, 13, 24).toISO(),
        },
      ],
    },
    {
      day: DateTime.utc(2021, 3, 16).toISO(),
      id: "28c19343-d7f9-4ece-b28d-4de864256fc0",

      video: "",
      thumbnail: "",
      notes: [
        {
          title: "h",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
          time: DateTime.utc(2022, 3, 16, 10, 24).toISO(),
        },
        {
          title: "Lorem ipasdfsum ",
          text: "This That asdfasdfThis That This That This That This That This That",
          time: DateTime.utc(2022, 3, 16, 13, 22).toISO(),
        },
        {
          title: "Ya yee ",
          text: "This That This That This That This That This That This That",
          time: DateTime.utc(2022, 3, 16, 13, 24).toISO(),
        },
      ],
    },
  ],
};
