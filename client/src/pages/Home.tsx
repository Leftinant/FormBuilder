import FormBuilder from "../components/FormBuilder";

const Home = () => {
  return (
    <div className='min-h-screen bg-base-200 p-6'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-bold mb-4'>Form Builder</h1>
        <FormBuilder />
      </div>
    </div>
  );
};

export default Home;
