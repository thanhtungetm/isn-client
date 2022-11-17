

export default function Example(){


  return (
    <>
      <h1>Test Page</h1>
      <div className="container flex justify-center items-center">
        <div className="relative">
          <button className="peer">
            Hover me!
          </button>
          <div className="hidden bg-slate-600 peer-hover:block absolute inset-x-auto rounded-md">
            <div className="w-60 text-white text-center">This is tooltip</div>
          </div>
        </div>
      </div>
    </>
  );
}