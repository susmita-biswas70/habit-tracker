const router = require('express').Router();
const Habit = require('../models/habitmodels');

// **********************************  Habits Get From Database   *********************************//
router.get('/', async (req, resp) => {
  try {
    const habits = await Habit.find().select('-updatedAt -createdAt -__v').sort({ _id: -1 });
    const days = [];
    days.push(getD(0));
    days.push(getD(1));
    days.push(getD(2));
    days.push(getD(3));
    days.push(getD(4));
    days.push(getD(5));
    days.push(getD(6));
    resp.render('habit', { habit: habits, days });
  } catch (err) {
    console.log(err);
  }
});

// ************************   Find the Date and Return the string Date  **************************//
function getD(n) {
  let d = new Date();
  d.setDate(d.getDate() + n);
  var newDate = d.toLocaleDateString('pt-br').split('/').reverse().join('-');
  var day;
  switch (d.getDay()) {
    case 0: day = 'Sun';
      break;
    case 1: day = 'Mon';
      break;
    case 2: day = 'Tue';
      break;
    case 3: day = 'Wed';
      break;
    case 4: day = 'Thu';
      break;
    case 5: day = 'Fri';
      break;
    case 6: day = 'Sat';
      break;
  }
  return { date: newDate, day };
}

router.post('/habit', async (req, resp) => {
  const { content } = req.body;
//   console.log(content);

  try {
    const habit = await Habit.findOne({ content: content });

    if (habit) {
      // ***********************   Update Existing Habit Status ************************//
      const dates = habit.dates;
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);

      const found = dates.some(item => item.date === today);

      if (found) {
        console.log("Habit Already inserted in Database");
        resp.redirect('back');
      } else {
        dates.push({ date: today, complete: 'none' });
        habit.dates = dates;
        await habit.save();
        // console.log(habit);
        resp.redirect('back');
      }
    } else {
      const dates = [];
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
      dates.push({ date: localISOTime, complete: 'none' });
      const newHabit = new Habit({
        content,
        dates
      });

      await newHabit.save();
    //   console.log(newHabit);
      resp.redirect('back');
    }
  } catch (err) {
    console.log(err);
  }
});

// ***************************   Habit Status Update per Days  ****************************//
router.get("/habitStatus", async (req, resp) => {
  try {
    const d = req.query.date;
    const id = req.query.id;
    const habit = await Habit.findById(id);
    const dates = habit.dates;

    let found = false;

    dates.forEach(item => {
      if (item.date === d) {
        if (item.complete === 'yes') {
          item.complete = 'no';
        } else if (item.complete === 'no') {
          item.complete = 'none';
        } else if (item.complete === 'none') {
          item.complete = 'yes';
        }
        found = true;
      }
    });

    if (!found) {
      dates.push({ date: d, complete: 'yes' });
    }

    habit.dates = dates;
    await habit.save();
    // console.log(habit);
    resp.redirect('back');
  } catch (err) {
    console.log("Habit status not updated", err);
    resp.status(500).send("Error updating habit status");
  }
});

// *************************   Delete  Habit        ***************************//
router.get("/:id", async (req, resp) => {
  try {
    const documentProduct = await Habit.findOneAndRemove({ _id: req.params.id });
    if (!documentProduct) {
      resp.status(500).json(err);
    }
    resp.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
