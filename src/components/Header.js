import RocketLogo from "./rocket.png"; // Import the image
function Header() {
  return (
    <header className="app-header">
      <img src={RocketLogo} alt="RocketLogo" />
      <h1>Astronomy Quiz</h1>
    </header>
  );
}

export default Header;