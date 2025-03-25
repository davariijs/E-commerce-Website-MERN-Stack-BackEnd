module.exports = async () => {
    // Add a delay to ensure connections close properly
    await new Promise(resolve => setTimeout(resolve, 500));
  };