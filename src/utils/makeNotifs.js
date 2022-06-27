import notifee, { TriggerType } from "@notifee/react-native";
export default makeNotifs = async () => {
  const notifs = await notifee.getTriggerNotifications();
  console.log(notifs);
  const reminderChannel = await notifee.createChannel({
    id: "default",
    name: "Reminders to record your day!",
  });

  const tomorrowDate = new Date(Date.now());
  const reminderDate = new Date(Date.now());

  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  reminderDate.setDate(reminderDate.getDate() + 3);
  tomorrowDate.setHours(12);
  tomorrowDate.setMinutes(6);

  reminderDate.setHours(7);
  reminderDate.setMinutes(32);

  const triggerTomorrow = {
    type: TriggerType.TIMESTAMP,
    timestamp: tomorrowDate.getTime(),
  };

  const triggerReminder = {
    type: TriggerType.TIMESTAMP,
    timestamp: reminderDate.getTime(),
  };
  const x = await notifee.createTriggerNotification(
    {
      title: "Start Recording!",
      body: "It only takes a few seconds to record moments from your day",
      android: {
        channelId: "default",
      },
    },
    triggerTomorrow
  );
  await notifee.createTriggerNotification(
    {
      title: "Record today",
      body: "Start today off right! Record your morning",
      android: {
        channelId: "default",
      },
    },
    triggerReminder
  );
};
