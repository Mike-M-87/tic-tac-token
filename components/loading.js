export default function LoadingScreen() {
  return (
    <div className="loadingview">
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}