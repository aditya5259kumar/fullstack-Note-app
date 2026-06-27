const getInitials = (name) => {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return words[0][0].toUpperCase() + words[1][0].toUpperCase();
};

const Profile = ({ userInfo, ProfileHandler }) => {
  if (!userInfo) {
    return null;
  }
  return (
    <div className="flex items-center gap-3">
      <div onClick={ProfileHandler}
        className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full 
                text-white font-semibold bg-purple-600 
                hover:shadow-md transition-all hover:scale-105"
      >
        {getInitials(userInfo.name)}
      </div>
    </div>
  );
};

export default Profile;