import ProfileContent from "./profileContent";
import ProfileHeader from "./profileHeader";

export default function PrfilePage()
{
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
