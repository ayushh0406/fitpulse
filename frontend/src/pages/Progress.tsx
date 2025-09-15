const Progress = () => {
  return (
    <div className="min-h-screen bg-background py-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="heading-brutal text-3xl lg:text-4xl font-black mb-8 text-center">
          Progress & <span className="text-fitness-green">Community</span>
        </h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">
            All static/demo data has been removed.<br />
            Please connect to real user data to display progress and community feed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Progress;