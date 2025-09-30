import ComingSoon from '../../components/common/ComingSoon';

const Profile = () => {
  const profileIcon = (
    <svg className="h-16 w-16 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <ComingSoon
      title="User Profile"
      description="Manage your personal information, preferences, and account settings. Customize your profile to connect better with fellow club members."
      icon={profileIcon}
    />
  );
};

export default Profile;