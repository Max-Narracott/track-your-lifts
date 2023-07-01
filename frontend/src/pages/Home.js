import { useEffect, useState } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Home = () => {
  //   const [workouts, setWorkouts] = useState(null);
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [selected, setSelected] = useState(Date.now());


  let footer = <p>Please pick a day.</p>;

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch("/api/workouts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        const timestamp = new Date(selected);
        const timestampString = timestamp.toLocaleDateString();

        const array = json.filter((workout) => {
          const date = new Date(workout.createdAt);
          const dateString = date.toLocaleDateString();

          return dateString === timestampString;
        });

        // setWorkouts(json);
        dispatch({ type: "SET_WORKOUTS", payload: array });
      }
    };
    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user, selected]);

  if (selected) {
    footer = <p>Showing workouts for {format(selected, "PP")}.</p>;
  }

  return (
    <div className="home">
      <div className="workouts">
        {/* <p>{Date(selected)}</p> */}

        {workouts && workouts.length > 0 ? (
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))
        ) : (
          <div className="workout-details">
            <h4>There are no workouts on this date.</h4>
          </div>
        )}
      </div>
      <WorkoutForm />
      <div />
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        footer={footer}
      />
    </div>
  );
};

export default Home;
