const AccessDenied = ({ role }) => {
  return (
    <div className=" text-xl flex flex-col justify-center items-center">
      <p className="text-red-600">Access Denied</p>
      <p>
        Required proper role, current role is:{" "}
        <span className="text-green-700/50">{role.toUpperCase()}</span>
      </p>
    </div>
  );
};

export default AccessDenied;
