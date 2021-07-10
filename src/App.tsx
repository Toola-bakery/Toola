import { Card, Button } from "tabler-react";
import "tabler-react/dist/Tabler.css";
import "./App.css";

function App() {
  return (
    <Card>
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
      </Card.Header>
      <Card.Body>
        <Button color="primary">A Button</Button>
      </Card.Body>
    </Card>
  );
}

export default App;
