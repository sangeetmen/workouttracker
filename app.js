$(document).ready(function() {
    console.log('FitTrack app initializing...');
    
    // Application state - using in-memory storage instead of localStorage
    let currentSection = 'search-section';
    let exercises = [];
    let workouts = [];
    let currentWorkout = null;

    // Sample data initialization
    // const sampleExercises = [
    //     {
    //         id: 1,
    //         name: "Bench Press",
    //         category: "Upper Body",
    //         equipment: "Barbell, Bench",
    //         muscleGroups: ["Chest", "Triceps", "Shoulders"],
    //         type: "strength"
    //     },
    //     {
    //         id: 2,
    //         name: "Squats",
    //         category: "Lower Body", 
    //         equipment: "Barbell, Squat Rack",
    //         muscleGroups: ["Quadriceps", "Glutes", "Core"],
    //         type: "strength"
    //     },
    //     {
    //         id: 3,
    //         name: "Treadmill",
    //         category: "Cardio",
    //         equipment: "Treadmill",
    //         muscleGroups: ["Legs", "Cardiovascular"],
    //         type: "cardio"
    //     },
    //     {
    //         id: 4,
    //         name: "Freestyle Swimming",
    //         category: "Swimming",
    //         equipment: "Pool",
    //         muscleGroups: ["Full Body", "Cardiovascular"],
    //         type: "swimming"
    //     },
    //     {
    //         id: 5,
    //         name: "Plank",
    //         category: "Core",
    //         equipment: "None",
    //         muscleGroups: ["Core", "Shoulders"],
    //         type: "strength"
    //     },
    //     {
    //         id: 6,
    //         name: "Dynamic Stretching",
    //         category: "Mobility",
    //         equipment: "None", 
    //         muscleGroups: ["Full Body"],
    //         type: "mobility"
    //     },
    //     {
    //         id: 7,
    //         name: "Deadlift",
    //         category: "Lower Body",
    //         equipment: "Barbell",
    //         muscleGroups: ["Hamstrings", "Glutes", "Back"],
    //         type: "strength"
    //     },
    //     {
    //         id: 8,
    //         name: "Pull-ups",
    //         category: "Upper Body",
    //         equipment: "Pull-up Bar",
    //         muscleGroups: ["Back", "Biceps"],
    //         type: "strength"
    //     },
    //     {
    //         id: 9,
    //         name: "Stationary Bike",
    //         category: "Cardio",
    //         equipment: "Exercise Bike",
    //         muscleGroups: ["Legs", "Cardiovascular"],
    //         type: "cardio"
    //     }
    // ];

    // Initialize application
    function initApp() {
        console.log('Initializing app...');
        loadData();
        initNavigation();
        initEventListeners();
        setTodaysDate();
        updateStreakCounter();
        loadRecentWorkouts();
        loadExercisesList();
        showToast('Welcome to FitTrack!');
        console.log('App initialization complete');
    }

    // Data management - using in-memory storage
    function loadData() {
        console.log('Loading data...');
        exercises = [...sampleExercises];
        workouts = [
            // Sample workout data
            {
                id: "1",
                date: "2024-10-08",
                exercises: [{
                    id: "1",
                    exerciseId: 1,
                    exerciseName: "Bench Press",
                    category: "Upper Body",
                    type: "strength",
                    sets: 3,
                    reps: "10,8,6",
                    weight: 70,
                    restTime: 2,
                    notes: "Felt strong today"
                }]
            },
            {
                id: "2", 
                date: "2024-10-07",
                exercises: [{
                    id: "2",
                    exerciseId: 2,
                    exerciseName: "Squats",
                    category: "Lower Body",
                    type: "strength",
                    sets: 4,
                    reps: "12,10,8,6",
                    weight: 80,
                    restTime: 3,
                    notes: "Good depth"
                }]
            }
        ];
        console.log('Data loaded:', { exercises: exercises.length, workouts: workouts.length });
    }

    // Navigation - CRITICAL FIX
    function initNavigation() {
        console.log('Initializing navigation...');
        
        // Remove any existing event handlers to prevent duplicates
        $('.nav-item').off('click');
        
        // Add click handler for navigation items
        $('.nav-item').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetSection = $(this).data('section');
            console.log('Navigation clicked:', targetSection);
            
            if (targetSection && targetSection !== currentSection) {
                switchSection(targetSection);
            }
        });
        
        // Also handle touch events for mobile
        $('.nav-item').on('touchend', function(e) {
            e.preventDefault();
            const targetSection = $(this).data('section');
            console.log('Navigation touched:', targetSection);
            
            if (targetSection && targetSection !== currentSection) {
                switchSection(targetSection);
            }
        });
        
        console.log('Navigation handlers bound to', $('.nav-item').length, 'items');
    }

    function switchSection(sectionId) {
        console.log('Switching from', currentSection, 'to', sectionId);
        
        // Update navigation active state
        $('.nav-item').removeClass('active');
        $(`.nav-item[data-section="${sectionId}"]`).addClass('active');
        
        // Hide all content sections
        $('.content-section').removeClass('active');
        
        // Show target section
        $(`#${sectionId}`).addClass('active');
        
        currentSection = sectionId;
        console.log('Section switched successfully to:', currentSection);

        // Section-specific updates
        if (sectionId === 'search-section') {
            loadRecentWorkouts();
        } else if (sectionId === 'entry-section') {
            updateCurrentWorkoutDisplay();
        } else if (sectionId === 'master-section') {
            loadExercisesList();
        }
        
        // Show toast to confirm navigation
        showToast(`Switched to ${sectionId.replace('-section', '').replace('-', ' ')} section`);
    }

    // Event listeners
    function initEventListeners() {
        console.log('Initializing event listeners...');
        
        // Exercise category change
        $('#exercise-category').on('change', function() {
            const category = $(this).val();
            console.log('Category changed to:', category);
            updateExerciseDropdown(category);
            updateDynamicFormFields();
        });

        // Exercise selection change
        $('#exercise-select').on('change', function() {
            const exerciseId = $(this).val();
            console.log('Exercise selected:', exerciseId);
            updateDynamicFormFields();
        });

        // Workout form submission
        $('#workout-form').on('submit', function(e) {
            e.preventDefault();
            console.log('Workout form submitted');
            saveWorkout();
        });

        // Add exercise form submission
        $('#add-exercise-form').on('submit', function(e) {
            e.preventDefault();
            console.log('Add exercise form submitted');
            addNewExercise();
        });

        // Search functionality
        $('#search-btn').on('click', function() {
            console.log('Search button clicked');
            performSearch();
        });
        
        $('#search-input').on('keypress', function(e) {
            if (e.which === 13) {
                console.log('Search input enter pressed');
                performSearch();
            }
        });

        // Modal close
        $(document).on('click', '.modal-close', function() {
            console.log('Modal close clicked');
            $(this).closest('.modal').removeClass('active').addClass('hidden');
        });

        // Category filter in master section
        $('#filter-category').on('change', function() {
            console.log('Filter category changed');
            loadExercisesList();
        });

        console.log('Event listeners initialized');
    }

    // Set today's date
    function setTodaysDate() {
        const today = new Date().toISOString().split('T')[0];
        $('#workout-date').val(today);
        console.log('Date set to:', today);
    }

    // Update exercise dropdown based on category
    function updateExerciseDropdown(category) {
        const $exerciseSelect = $('#exercise-select');
        $exerciseSelect.empty().append('<option value="">Select Exercise</option>');

        if (category === 'Rest Day') {
            $exerciseSelect.append('<option value="rest_day">Rest Day</option>');
            $('#exercise-selection-group').hide();
            return;
        } else {
            $('#exercise-selection-group').show();
        }

        const filteredExercises = exercises.filter(ex => ex.category === category);
        filteredExercises.forEach(exercise => {
            $exerciseSelect.append(`<option value="${exercise.id}">${exercise.name}</option>`);
        });
        
        console.log('Exercise dropdown updated with', filteredExercises.length, 'exercises');
    }

    // Update dynamic form fields
    function updateDynamicFormFields() {
        const category = $('#exercise-category').val();
        const exerciseId = $('#exercise-select').val();
        const $dynamicFields = $('#dynamic-form-fields');
        
        $dynamicFields.empty();

        if (!category || (!exerciseId && category !== 'Rest Day')) return;

        if (category === 'Rest Day') {
            $dynamicFields.html(`
                <div class="dynamic-field-group">
                    <h5>Rest Day</h5>
                    <div class="form-group">
                        <label class="form-label">Notes (Optional)</label>
                        <textarea class="form-control" id="rest-notes" rows="3" placeholder="How did you feel today? Any recovery activities?"></textarea>
                    </div>
                </div>
            `);
            return;
        }

        const exercise = exercises.find(ex => ex.id == exerciseId);
        if (!exercise) return;

        let fieldsHtml = '<div class="dynamic-field-group">';
        fieldsHtml += `<h5>${exercise.name}</h5>`;

        if (exercise.type === 'strength' || exercise.category === 'Core') {
            fieldsHtml += `
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Sets</label>
                        <input type="number" class="form-control" id="sets" min="1" placeholder="3">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Reps (per set)</label>
                        <input type="text" class="form-control" id="reps" placeholder="12,10,8">
                    </div>
                </div>
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Weight (kg)</label>
                        <input type="number" class="form-control" id="weight" step="0.5" placeholder="50">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rest Between Sets (min)</label>
                        <input type="number" class="form-control" id="rest-time" step="0.5" placeholder="2">
                    </div>
                </div>
            `;
        } else if (exercise.type === 'cardio') {
            fieldsHtml += `
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Duration (minutes)</label>
                        <input type="number" class="form-control" id="duration" min="1" placeholder="30">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Distance (km)</label>
                        <input type="number" class="form-control" id="distance" step="0.1" placeholder="5.0">
                    </div>
                </div>
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Average Speed (km/h)</label>
                        <input type="number" class="form-control" id="speed" step="0.1" placeholder="10.0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Incline (%)</label>
                        <input type="number" class="form-control" id="incline" step="0.5" placeholder="2.0">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Calories Burned (optional)</label>
                    <input type="number" class="form-control" id="calories" placeholder="300">
                </div>
            `;
        } else if (exercise.type === 'swimming') {
            fieldsHtml += `
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Laps</label>
                        <input type="number" class="form-control" id="laps" min="1" placeholder="20">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pool Length</label>
                        <select class="form-control" id="pool-length">
                            <option value="25m">25m</option>
                            <option value="50m">50m</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Total Time (minutes)</label>
                        <input type="number" class="form-control" id="total-time" step="0.5" placeholder="45">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stroke Type</label>
                        <select class="form-control" id="stroke-type">
                            <option value="Freestyle">Freestyle</option>
                            <option value="Backstroke">Backstroke</option>
                            <option value="Breaststroke">Breaststroke</option>
                            <option value="Butterfly">Butterfly</option>
                        </select>
                    </div>
                </div>
            `;
        } else if (exercise.type === 'mobility') {
            fieldsHtml += `
                <div class="field-row">
                    <div class="form-group">
                        <label class="form-label">Duration (minutes)</label>
                        <input type="number" class="form-control" id="duration" min="1" placeholder="15">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Intensity</label>
                        <select class="form-control" id="intensity">
                            <option value="Light">Light</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Intense">Intense</option>
                        </select>
                    </div>
                </div>
            `;
        }

        fieldsHtml += `
            <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <textarea class="form-control" id="exercise-notes" rows="2" placeholder="How did it feel? Any observations?"></textarea>
            </div>
        `;
        
        fieldsHtml += '</div>';
        $dynamicFields.html(fieldsHtml);
    }

    // Save workout
    function saveWorkout() {
        const workoutData = collectWorkoutData();
        if (!workoutData) return;

        // Add to workouts array
        const workoutId = Date.now().toString();
        const workout = {
            id: workoutId,
            date: workoutData.date,
            exercises: [workoutData]
        };

        // Check if workout for this date already exists
        const existingWorkoutIndex = workouts.findIndex(w => w.date === workoutData.date);
        if (existingWorkoutIndex !== -1) {
            workouts[existingWorkoutIndex].exercises.push(workoutData);
        } else {
            workouts.push(workout);
        }

        console.log('Workout saved:', workoutData);
        showToast('Workout saved successfully!');
        updateCurrentWorkoutDisplay();
        clearForm();
        updateStreakCounter();
        loadRecentWorkouts();
    }

    // Collect workout data from form
    function collectWorkoutData() {
        const date = $('#workout-date').val();
        const category = $('#exercise-category').val();
        const exerciseId = $('#exercise-select').val();

        if (!date || !category) {
            showToast('Please fill in all required fields', 'error');
            return null;
        }

        const data = {
            id: Date.now().toString(),
            date: date,
            category: category,
            timestamp: new Date().toISOString()
        };

        if (category === 'Rest Day') {
            data.exerciseId = 'rest_day';
            data.exerciseName = 'Rest Day';
            data.notes = $('#rest-notes').val();
            data.type = 'rest';
            return data;
        }

        if (!exerciseId) {
            showToast('Please select an exercise', 'error');
            return null;
        }

        const exercise = exercises.find(ex => ex.id == exerciseId);
        data.exerciseId = exerciseId;
        data.exerciseName = exercise.name;
        data.type = exercise.type;

        // Collect type-specific data
        if (exercise.type === 'strength' || exercise.category === 'Core') {
            data.sets = parseInt($('#sets').val()) || 0;
            data.reps = $('#reps').val();
            data.weight = parseFloat($('#weight').val()) || 0;
            data.restTime = parseFloat($('#rest-time').val()) || 0;
        } else if (exercise.type === 'cardio') {
            data.duration = parseInt($('#duration').val()) || 0;
            data.distance = parseFloat($('#distance').val()) || 0;
            data.speed = parseFloat($('#speed').val()) || 0;
            data.incline = parseFloat($('#incline').val()) || 0;
            data.calories = parseInt($('#calories').val()) || 0;
        } else if (exercise.type === 'swimming') {
            data.laps = parseInt($('#laps').val()) || 0;
            data.poolLength = $('#pool-length').val();
            data.totalTime = parseFloat($('#total-time').val()) || 0;
            data.strokeType = $('#stroke-type').val();
        } else if (exercise.type === 'mobility') {
            data.duration = parseInt($('#duration').val()) || 0;
            data.intensity = $('#intensity').val();
        }

        data.notes = $('#exercise-notes').val();
        return data;
    }

    // Clear form
    function clearForm() {
        $('#workout-form')[0].reset();
        $('#dynamic-form-fields').empty();
        setTodaysDate();
    }

    // Update current workout display
    function updateCurrentWorkoutDisplay() {
        const today = new Date().toISOString().split('T')[0];
        const todayWorkouts = workouts.filter(w => w.date === today);
        
        if (todayWorkouts.length === 0) {
            $('#current-workout-exercises').addClass('hidden');
            return;
        }

        const exercises = [];
        todayWorkouts.forEach(workout => {
            exercises.push(...workout.exercises);
        });

        let exercisesHtml = '';
        exercises.forEach(exercise => {
            exercisesHtml += `
                <div class="exercise-item">
                    <div class="exercise-item-header">
                        <span class="exercise-item-name">${exercise.exerciseName}</span>
                        <span class="exercise-item-category">${exercise.category}</span>
                    </div>
                    <div class="exercise-item-details">
                        ${formatExerciseDetails(exercise)}
                    </div>
                </div>
            `;
        });

        $('#exercises-list').html(exercisesHtml);
        $('#current-workout-exercises').removeClass('hidden');
    }

    // Format exercise details for display
    function formatExerciseDetails(exercise) {
        if (exercise.type === 'rest') {
            return exercise.notes || 'Rest day logged';
        } else if (exercise.type === 'strength') {
            return `${exercise.sets} sets × ${exercise.reps} reps @ ${exercise.weight}kg`;
        } else if (exercise.type === 'cardio') {
            return `${exercise.duration} min, ${exercise.distance}km @ ${exercise.speed}km/h`;
        } else if (exercise.type === 'swimming') {
            return `${exercise.laps} laps (${exercise.poolLength}), ${exercise.totalTime} min`;
        } else if (exercise.type === 'mobility') {
            return `${exercise.duration} min, ${exercise.intensity} intensity`;
        }
        return '';
    }

    // Load recent workouts
    function loadRecentWorkouts() {
        console.log('Loading recent workouts...');
        const recentWorkouts = workouts
            .slice(-10)
            .reverse()
            .map(workout => {
                const exercises = workout.exercises || [];
                return {
                    date: workout.date,
                    exerciseCount: exercises.length,
                    categories: [...new Set(exercises.map(e => e.category))],
                    totalVolume: calculateWorkoutVolume(exercises),
                    exercises: exercises
                };
            });

        let workoutsHtml = '';
        if (recentWorkouts.length === 0) {
            workoutsHtml = `
                <div class="card text-center">
                    <div class="card__body">
                        <h4>No workouts yet</h4>
                        <p>Start by logging your first workout in the Entry tab!</p>
                    </div>
                </div>
            `;
        } else {
            recentWorkouts.forEach(workout => {
                const formattedDate = new Date(workout.date).toLocaleDateString();
                workoutsHtml += `
                    <div class="workout-card" data-date="${workout.date}">
                        <div class="workout-card-header">
                            <div class="workout-card-title">${formattedDate}</div>
                            <div class="workout-card-category">${workout.exerciseCount} exercises</div>
                        </div>
                        <div class="workout-card-stats">
                            <div class="workout-stat">
                                <span class="workout-stat-value">${workout.categories.length}</span>
                                <span class="workout-stat-label">Categories</span>
                            </div>
                            <div class="workout-stat">
                                <span class="workout-stat-value">${workout.totalVolume}</span>
                                <span class="workout-stat-label">Volume</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        $('#recent-workouts-list').html(workoutsHtml);

        // Add click handlers for workout cards using event delegation
        $(document).off('click', '.workout-card').on('click', '.workout-card', function() {
            const date = $(this).data('date');
            console.log('Workout card clicked:', date);
            showWorkoutDetail(date);
        });
    }

    // Calculate workout volume
    function calculateWorkoutVolume(exercises) {
        let volume = 0;
        exercises.forEach(exercise => {
            if (exercise.type === 'strength') {
                const repsArray = exercise.reps ? exercise.reps.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r)) : [];
                const totalReps = repsArray.reduce((sum, reps) => sum + reps, 0);
                volume += totalReps * (exercise.weight || 0);
            } else if (exercise.type === 'cardio') {
                volume += (exercise.distance || 0) * 10; // Arbitrary volume calculation
            }
        });
        return volume.toFixed(0);
    }

    // Show workout detail modal
    function showWorkoutDetail(date) {
        const workout = workouts.find(w => w.date === date);
        if (!workout) return;

        const exercises = workout.exercises || [];
        let modalHtml = `
            <div class="modal-header">
                <h3>Workout - ${new Date(date).toLocaleDateString()}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="workout-detail-exercises">
        `;

        exercises.forEach(exercise => {
            modalHtml += `
                <div class="sessions-summary-item">
                    <div class="session-date">${exercise.exerciseName}</div>
                    <div class="session-details">${formatExerciseDetails(exercise)}</div>
                    ${exercise.notes ? `<div class="session-notes"><strong>Notes:</strong> ${exercise.notes}</div>` : ''}
                </div>
            `;
        });

        modalHtml += `
                </div>
            </div>
        `;

        $('#workout-detail-modal .modal-content').html(modalHtml);
        $('#workout-detail-modal').removeClass('hidden').addClass('active');
    }

    // Search functionality
    function performSearch() {
        const query = $('#search-input').val().toLowerCase().trim();
        if (!query) {
            $('#search-results').addClass('hidden');
            return;
        }

        console.log('Performing search for:', query);

        // Search in exercises and workouts
        const matchingExercises = exercises.filter(ex => 
            ex.name.toLowerCase().includes(query) || 
            ex.category.toLowerCase().includes(query) ||
            ex.muscleGroups.some(mg => mg.toLowerCase().includes(query))
        );

        const matchingWorkouts = workouts.filter(w => 
            w.exercises && w.exercises.some(ex => 
                ex.exerciseName.toLowerCase().includes(query) ||
                ex.category.toLowerCase().includes(query)
            )
        );

        let resultsHtml = '';
        
        if (matchingExercises.length > 0) {
            resultsHtml += '<h4>Exercises</h4>';
            matchingExercises.forEach(exercise => {
                const workoutsWithExercise = workouts.filter(w => 
                    w.exercises && w.exercises.some(ex => ex.exerciseId == exercise.id)
                );
                
                resultsHtml += `
                    <div class="workout-card search-result-exercise" data-exercise-id="${exercise.id}">
                        <div class="workout-card-header">
                            <div class="workout-card-title">${exercise.name}</div>
                            <div class="workout-card-category">${exercise.category}</div>
                        </div>
                        <div class="workout-card-stats">
                            <div class="workout-stat">
                                <span class="workout-stat-value">${workoutsWithExercise.length}</span>
                                <span class="workout-stat-label">Sessions</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        if (matchingWorkouts.length > 0) {
            resultsHtml += '<h4>Workout Sessions</h4>';
            matchingWorkouts.forEach(workout => {
                const formattedDate = new Date(workout.date).toLocaleDateString();
                resultsHtml += `
                    <div class="workout-card" data-date="${workout.date}">
                        <div class="workout-card-header">
                            <div class="workout-card-title">${formattedDate}</div>
                            <div class="workout-card-category">${workout.exercises.length} exercises</div>
                        </div>
                    </div>
                `;
            });
        }

        if (resultsHtml === '') {
            resultsHtml = '<p>No results found for "' + query + '"</p>';
        }

        $('#search-results-list').html(resultsHtml);
        $('#search-results').removeClass('hidden');
    }

    // Add new exercise
    function addNewExercise() {
        const name = $('#new-exercise-name').val().trim();
        const category = $('#new-exercise-category').val();
        const equipment = $('#new-exercise-equipment').val().trim();
        
        if (!name || !category) {
            showToast('Please fill in exercise name and category', 'error');
            return;
        }

        // Check if exercise already exists
        if (exercises.some(ex => ex.name.toLowerCase() === name.toLowerCase())) {
            showToast('Exercise already exists', 'error');
            return;
        }

        const muscleGroups = [];
        $('#muscle-groups-checkboxes input:checked').each(function() {
            muscleGroups.push($(this).val());
        });

        const newExercise = {
            id: Date.now(),
            name: name,
            category: category,
            equipment: equipment || 'None',
            muscleGroups: muscleGroups,
            type: getExerciseType(category)
        };

        exercises.push(newExercise);
        
        // Clear form
        $('#add-exercise-form')[0].reset();
        $('#muscle-groups-checkboxes input').prop('checked', false);
        
        console.log('New exercise added:', newExercise);
        showToast('Exercise added successfully!');
        loadExercisesList();
    }

    // Get exercise type based on category
    function getExerciseType(category) {
        const typeMap = {
            'Upper Body': 'strength',
            'Lower Body': 'strength',
            'Core': 'strength',
            'Cardio': 'cardio',
            'Swimming': 'swimming',
            'Mobility': 'mobility'
        };
        return typeMap[category] || 'strength';
    }

    // Load exercises list for master management
    function loadExercisesList() {
        const filterCategory = $('#filter-category').val();
        let filteredExercises = exercises;
        
        if (filterCategory) {
            filteredExercises = exercises.filter(ex => ex.category === filterCategory);
        }

        let exercisesHtml = '';
        filteredExercises.forEach(exercise => {
            exercisesHtml += `
                <div class="exercise-master-item">
                    <div class="exercise-master-header">
                        <div class="exercise-master-name">${exercise.name}</div>
                        <div class="exercise-master-category">${exercise.category}</div>
                    </div>
                    <div class="exercise-master-details">
                        <strong>Equipment:</strong> ${exercise.equipment}
                    </div>
                    <div class="exercise-master-muscles">
                        ${exercise.muscleGroups.map(mg => `<span class="muscle-tag">${mg}</span>`).join('')}
                    </div>
                </div>
            `;
        });

        if (exercisesHtml === '') {
            exercisesHtml = '<p class="text-center">No exercises found in this category.</p>';
        }

        $('#exercises-list-master').html(exercisesHtml);
    }

    // Update streak counter
    function updateStreakCounter() {
        const streak = calculateWorkoutStreak();
        $('#streak-display').text(`Streak: ${streak} days`);
    }

    // Calculate workout streak
    function calculateWorkoutStreak() {
        if (workouts.length === 0) return 0;

        const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let currentDate = new Date(today);

        for (let i = 0; i < sortedWorkouts.length; i++) {
            const workoutDate = new Date(sortedWorkouts[i].date);
            workoutDate.setHours(0, 0, 0, 0);

            if (workoutDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (workoutDate.getTime() < currentDate.getTime()) {
                // Gap in streak
                break;
            }
        }

        return streak;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        console.log('Toast:', message, type);
        const $toast = $('#toast');
        const $toastMessage = $('#toast-message');
        
        $toastMessage.text(message);
        
        if (type === 'error') {
            $toast.css('background', 'linear-gradient(135deg, #ff1493, #ff69b4)');
        } else {
            $toast.css('background', 'linear-gradient(135deg, #00ff41, #00cc33)');
        }
        
        $toast.removeClass('hidden');
        
        setTimeout(() => {
            $toast.addClass('hidden');
        }, 3000);
    }

    // Initialize the application
    initApp();
    
    // Debugging: Log navigation elements after initialization
    console.log('Navigation elements found:', $('.nav-item').length);
    $('.nav-item').each(function(index) {
        console.log(`Nav item ${index}:`, $(this).data('section'), $(this).hasClass('active'));
    });
    
    // Additional debugging: Test navigation programmatically
    setTimeout(() => {
        console.log('Testing navigation after 1 second...');
        console.log('Current section:', currentSection);
        console.log('Available sections:', $('.content-section').map(function() { return this.id; }).get());
    }, 1000);
});
