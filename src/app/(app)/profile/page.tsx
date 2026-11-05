import { redirect } from "next/navigation";
import { getProfile } from "@/api";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const response = await getProfile();

  if (!response.data) {
    redirect("/login");
  }

  const { user } = response.data;

  return (
    <section className="border-grey-200 rounded-card mx-auto flex max-w-[1215px] flex-col gap-10 border bg-white px-6 py-10 md:px-[59px]">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg">Mon compte</h1>
        <p className="text-grey-600">{user.name ?? user.email}</p>
      </div>

      <ProfileForm user={user} />
    </section>
  );
}
