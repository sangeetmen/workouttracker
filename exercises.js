const sampleExercises = [
    {
      "id": 1,
      "name": "Lying Chest Press Machine (Flat)",
      "category": "Upper Body",
      "muscleGroups": [
        "Chest",
        "Triceps",
        "Shoulders"
      ],
      "type": "Strength",
      "image": "https://i.pinimg.com/originals/d8/1b/47/d81b4799318a6b03520967910cbbc66d.gif"
    },
    {
      "id": 2,
      "name": "Body Weighted Squats",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Core"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/05/Bodyweight-Squat.gif"
    },
    {
      "id": 3,
      "name": "Treadmill",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "Cardio",
      "image": "https://hips.hearstapps.com/hmg-prod/images/lifestyle-gym-and-fitness-barcelona-athlete-running-royalty-free-image-1577740444.jpg?crop=0.668xw:1.00xh;0,0&resize=1400:*"
    },
    {
      "id": 4,
      "name": "Swimming",
      "category": "Swimming",
      "muscleGroups": [
        "Full Body",
        "Cardiovascular"
      ],
      "type": "Swimming",
      "image": "https://blog.arenaswim.com/wp-content/uploads/2021/02/arena_crawl_blog_nologo.gif"
    },
    {
      "id": 5,
      "name": "Plank",
      "category": "Core",
      "muscleGroups": [
        "Core",
        "Shoulders"
      ],
      "type": "Strength",
      "image": "https://www.endomondo.com/wp-content/uploads/2024/07/Plank.png"
    },
    {
      "id": 6,
      "name": "Dynamic Stretching",
      "category": "Mobility",
      "muscleGroups": [
        "Full Body"
      ],
      "type": "Mobility",
      "image": ""
    },
    {
      "id": 7,
      "name": "Dumbbell Deadlift",
      "category": "Lower Body",
      "muscleGroups": [
        "Hamstrings",
        "Glutes",
        "Back"
      ],
      "type": "Strength",
      "image": "https://burnfit.io/wp-content/uploads/2023/11/DB_RM_DL.gif"
    },
    {
      "id": 8,
      "name": "Assisted Pull-up Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Back",
        "Biceps"
      ],
      "type": "Strength",
      "image": "https://burnfit.io/wp-content/uploads/2023/11/ASS_PULLUP_MC.gif"
    },
    {
      "id": 9,
      "name": "Cycling",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "Cardio",
      "image": "https://i.pinimg.com/originals/02/b6/2b/02b62b7ee1484dcb9331297658803a9f.gif"
    },
    {
      "id": 10,
      "name": "Rest Day",
      "category": "Rest",
      "muscleGroups": [
        "Full Body"
      ],
      "type": "Rest",
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzg95-gmqTQdfiFmIFuLFlnNJtwdkM58H6Jw&s"
    },
    {
      "id": 11,
      "name": "Machine Fly (Front)",
      "category": "Upper Body",
      "muscleGroups": [
        "Chest",
        "Shoulders"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif"
    },
    {
      "id": 12,
      "name": "Lat Pull Down (Front)",
      "category": "Upper Body",
      "muscleGroups": [
        "Lats",
        "Back",
		"Triceps"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif"
    }, 
	{
      "id": 13,
      "name": "Preacher Curl Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"
      ],
      "type": "Strength",
      "image": "https://burnfit.io/wp-content/uploads/2023/11/PREA_CURL_MAC.gif"
    }, 
	{
      "id": 14,
      "name": "Triceps Dip Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Triceps"
      ],
      "type": "Strength",
      "image": "https://burnfit.io/wp-content/uploads/2023/11/SEAT_DIPS_MC.gif"
    }, 
	{
      "id": 15,
      "name": "Dumbbell Front Raises",
      "category": "Upper Body",
      "muscleGroups": [
        "Shoulders",
		"Chest",
		"Biceps"
      ],
      "type": "Strength",
      "image": "https://newlife.com.cy/wp-content/uploads/2019/11/22331301-Dumbbell-Front-Raise-female_Shoulders_360-4.gif"
    }, 
	{
      "id": 16,
      "name": "Dumbbell Side (Lat) Raises",
      "category": "Upper Body",
      "muscleGroups": [
        "Lats",
		"Shoulder"		
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif"
    }, 
	{
      "id": 17,
      "name": "Dumbbell Bicep Curls",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"		
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif"
    }, 
	{
      "id": 18,
      "name": "Dumbbell Hammer Curls",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"		
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif"
    },
    {
      "id": 19,
      "name": "Leg Press Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif"
    },
    {
      "id": 20,
      "name": "Lunges",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2023/09/power-lunge.gif"
    },
    {
      "id": 21,
      "name": "Leg Curl Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Glutes",
        "Hamstrings"
      ],
      "type": "Strength",
      "image": "https://i.pinimg.com/originals/d9/ea/db/d9eadb96317b4a64eafb32ab0980d560.gif"
    },
    {
      "id": 22,
      "name": "Leg Extension Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "Strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif"
    },
    {
      "id": 23,
      "name": "Standing Calf Raises",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Gastrocnemius",
        "Soleus"
      ],
      "type": "Strength",
      "image": "https://burnfit.io/wp-content/uploads/2023/11/STD_CALF_RAISE.gif"
    },
    {
      "id": 24,
      "name": "Sitting Calf Raises",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Soleus"
      ],
      "type": "Strength",
      "image": "https://newlife.com.cy/wp-content/uploads/2019/11/26661301-Lever-Seated-Calf-Raise-plate-loaded-VERSION-2_Calves_360.gif"
    },
    {
      "id": 25,
      "name": "Crosfit (Eliptical)",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "Cardio",
      "image": "https://media4.giphy.com/media/ZZ2ZNjDgeg0EgqmaNR/giphy-downsized.gif"
    },
    {
      "id": 26,
      "name": "Leg Raises",
      "category": "Cardio",
      "muscleGroups": [
        "Quadriceps",
        "Abs",
		"Lower Back"
      ],
      "type": "Cardio",
      "image": "https://cdn.jefit.com/assets/img/exercises/gifs/44.gif"
    }
	
  ]
