type LoadingOrEmptyProps<T> = {
  loading: boolean;
  items: T[];
  renderEmpty: React.ReactNode;
  renderContent: (items: T[]) => React.ReactNode;
};

export default function LoadingOrEmpty<T>({
  loading,
  items,
  renderEmpty,
  renderContent,
}: LoadingOrEmptyProps<T>) {
  if (loading) {
    return (
      <div className="text-center text-gray-500">Carregando produtos...</div>
    );
  }
  if (items.length === 0) {
    return <div className="text-center text-gray-500">{renderEmpty}</div>;
  }
  return <>{renderContent(items)}</>;
}
