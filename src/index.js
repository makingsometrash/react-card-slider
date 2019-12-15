import React from "react";
import ReactDOM from "react-dom";
import ItemsCarousel from "react-items-carousel";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const CarouselCard = ({ carouselCard }) => (
  <Card>
    <CardMedia
      component="img"
      alt="Image"
      height="140"
      src={carouselCard.url}
      title="Card image"
    />
    <CardContent>{carouselCard.id}</CardContent>
  </Card>
);

export default class CardCarousel extends React.Component {
  componentWillMount() {
    this.setState({
      children: [],
      activeItemIndex: 0
    });
  }

  componentDidMount() {
    axios
      .get(window.encodeURI(`https://jsonplaceholder.typicode.com/photos/`))
      .then(response => {
        const children = response.data.slice(0, 15);
        this.setState({
          children,
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error: error,
          loading: false
        });
      });
  }

  changeActiveItem = activeItemIndex => this.setState({ activeItemIndex });

  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        <div>
          Sorry, an error ocurred: {this.state.error.response.data.message}
        </div>
      </div>
    );
  }

  renderList() {
    const { activeItemIndex, children, error } = this.state;

    if (error) {
      console.log(error);
      return this.renderError();
    }

    return (
      <ItemsCarousel
        // Placeholder configurations
        enablePlaceholder
        numberOfPlaceholderItems={3}
        minimumPlaceholderTime={1000}
        placeholderItem={
          <div style={{ height: 300, background: "grey" }}>Loading...</div>
        }
        // Carousel configurations
        numberOfCards={3}
        gutter={12}
        showSlither={false}
        firstAndLastGutter={false}
        freeScrolling={false}
        // Active item configurations
        requestToChangeActive={this.changeActiveItem}
        activeItemIndex={activeItemIndex}
        activePosition={"center"}
        chevronWidth={24}
        rightChevron={">"}
        leftChevron={"<"}
        outsideChevron={false}
      >
        {children.map((carouselCard, index) => (
          <CarouselCard
            carouselCard={carouselCard}
            index={index}
            key={carouselCard.id}
          />
        ))}
      </ItemsCarousel>
    );
  }

  render() {
    return this.state.loading ? this.renderLoading() : this.renderList();
  }
}

ReactDOM.render(<CardCarousel />, document.getElementById("app"));
