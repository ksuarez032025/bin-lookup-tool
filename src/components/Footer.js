export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container d-flex flex-column flex-sm-row align-items-start justify-content-between gap-2">
        <div className="small text-muted">
          © {year} Kristian Suarez — BIN Lookup Tool
        </div>

        <nav className="small links">
          <a
            href="https://github.com/ksuarez032025"
            target="_blank"
            rel="noreferrer"
            className="link-secondary me-3"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kristian-suarez-dev"
            target="_blank"
            rel="noreferrer"
            className="link-secondary me-3"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
