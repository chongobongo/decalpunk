// @slot/default.tsx
// This file serves as a fallback when a parallel route slot doesn't have a matching page

export default function Default() {
  return null;
}

// Alternative with content (uncomment if you want to show something):
/*
export default function Default() {
  return (
    <div className="p-4 text-gray-500">
      <p>Default content for this slot</p>
    </div>
  );
}
*/

// Alternative with loading state:
/*
export default function Default() {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}
*/