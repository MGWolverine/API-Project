import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="homepage">
      <div className="body">
        <section className="container1">
          <div className="info">
            <h1 className="title">
              The people platform—Where interests become friendships
            </h1>
            <p className="subtitle1">
              Whatever your interest, from hiking and reading to networking and
              skill sharing, there are thousands of people who share it on
              Meetup. Events are happening every day—sign up to join the fun.
            </p>
          </div>
          <img className="image1" src="https://i.imgur.com/9ti3y68.png"></img>
        </section>
        <section className="container2">
          <h2 className="title">How Not-Meetup works</h2>
          <p className="subtitle2">
            Meet new people who share your interests through online and in
            person events. It’s free to create an account.
          </p>
        </section>
        <section className="container3">
          <div className="navbox">
            <img className="image2" src="https://i.imgur.com/wKetZC8.png"></img>
            <div className="seeAllGroups">
              <Link className="link-seeAllGroups" to="/groups">
                See all groups
              </Link>
              <p className="subtitle2">
                Do what you love, meet others who love it, find your community.
                The rest is history!
              </p>
            </div>
          </div>
          <div className="navbox">
            <img className="image2" src="https://i.imgur.com/FeDQGGH.png"></img>
            <Link className="link-findevent" to="/events">
              Find an event
            </Link>
            <p className="subtitle2">
              Events are happening on just about any topic you can think of,
              from online gaming and photography to yoga and hiking.
            </p>
          </div>
          <div className="navbox">
            <img className="image2" src="https://i.imgur.com/g2nNOLu.png"></img>
            {sessionUser ? (
              <Link className="link-startGroup" to="/groups/new">
                Start a new group
              </Link>
            ) : (
              <p className="link-startGroup" style={{ color: "grey" }}>
                Start a new group
              </p>
            )}
            <p className="subtitle2">
              You don’t have to be an expert to gather people together and
              explore shared interests.
            </p>
          </div>
        </section>
        <section className="container 4">
          <div>
            <button className="joinButton">Join Not-Meetup</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
