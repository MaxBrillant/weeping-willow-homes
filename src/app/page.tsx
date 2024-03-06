import HomeSearch from "./components/homeSearch";
import TopBar from "./components/topBar";

export default function Homes() {
  return (
    <div className="flex flex-col flex-grow">
      <div>
        <p>Weeping willow Homes</p>
      </div>
      <div className="flex flex-col py-10 px-5 items-center">
        <HomeSearch />
      </div>
    </div>
  );
}
