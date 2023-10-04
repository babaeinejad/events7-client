import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export function Navigation() {
  return (
    <div className="flex justify-between h-8 bg-gray-900 text-white px-3 items-center">
      <div className="flex">
        <FontAwesomeIcon icon={faGear} />
      </div>
    </div>
  );
}
