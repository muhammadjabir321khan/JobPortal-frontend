function Sidebar() {
  const menuItems = ['Home', 'About', 'Dashboard']

  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Workspace</p>
        <h2>Navigation</h2>
      </div>
      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item}>
              <a href="/" onClick={(event) => event.preventDefault()}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
