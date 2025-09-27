export default function LoadingScreen (){
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-90">
      <div className="w-16 h-16 border-4 border-t-transparent border-black rounded-full animate-spin"></div>
    </div>
  );
};