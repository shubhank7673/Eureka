const getTimeRemaining = (startTime) => {
    let d = new Date();
    return (d - startTime)/1000;
};

module.exports = getTimeRemaining;