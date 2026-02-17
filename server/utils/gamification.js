const basePoints = {
    daily: 10,
    weekly: 30,
    monthly: 100
};

const calculateLevel = (totalPoints) => {
    return Math.floor(totalPoints / 500) + 1;
};

const updateGamification = async (user, task) => {
    const points = basePoints[task.type] || 0;

    user.xp += points;
    user.totalPoints += points;

    // Check for level up
    const newLevel = calculateLevel(user.totalPoints);
    if (newLevel > user.level) {
        user.level = newLevel;
        // Could add a 'levelUp' flag to user or return it to notify frontend
    }

    // Streak Logic
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate);

    // Normalize to midnight for date comparison
    today.setHours(0, 0, 0, 0);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Active yesterday, increment streak
        user.streak += 1;

        // 7-day streak bonus
        if (user.streak % 7 === 0) {
            user.xp += 50;
            user.totalPoints += 50;
        }
    } else if (diffDays > 1) {
        // Missed a day or more, reset streak
        user.streak = 1;
    } else if (diffDays === 0 && user.streak === 0) {
        // First task of the day (if streak was 0) or first ever
        user.streak = 1;
    }
    // If diffDays === 0 and streak > 0, we don't increment (already done for today)

    user.lastActiveDate = new Date();

    // Recalculate level after potential bonus
    const levelAfterBonus = calculateLevel(user.totalPoints);
    if (levelAfterBonus > user.level) {
        user.level = levelAfterBonus;
    }

    return user;
};

module.exports = { basePoints, calculateLevel, updateGamification };
