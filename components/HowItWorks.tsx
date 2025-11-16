export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Upload PDFs",
      description: "Drag and drop or click to select multiple PDF files from your device."
    },
    {
      number: "2",
      title: "Arrange Pages",
      description: "Preview all pages and drag them to arrange in your desired order."
    },
    {
      number: "3",
      title: "Download Merged PDF",
      description: "Click merge and instantly download your combined PDF file."
    }
  ];

  return (
    <section id="how-it-works" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Merge your PDFs in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-2xl font-bold text-white bg-gray-900 rounded-full">
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200" style={{ transform: 'translateX(50%)' }}></div>
              )}
              <h3 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}