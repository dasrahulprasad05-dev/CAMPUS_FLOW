import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentProfile } from "@/app/actions/student";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

export const metadata = {
  title: "Class Schedule | CampusFlow",
};

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default async function StudentSchedulePage() {
  const profile = await requireUser();
  if (profile.role !== "student") redirect("/login");

  const studentData = await getStudentProfile();
  if (!studentData) {
    return <div>Profile not found</div>;
  }

  // Get timetable slots for this student's section
  const slots = await prisma.timetableSlot.findMany({
    where: {
      teachingAssignment: {
        departmentId: studentData.departmentId,
        semester: studentData.semester,
        sectionId: studentData.sectionId,
      }
    },
    include: {
      teachingAssignment: {
        include: {
          subject: true,
          teacher: { include: { user: true } }
        }
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Class Schedule</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {daysOfWeek.map((day) => {
          const daySlots = slots.filter(s => s.dayOfWeek.toLowerCase() === day);
          if (daySlots.length === 0 && day === 'saturday') return null;

          return (
            <Card key={day} className="flex flex-col h-full">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg capitalize text-center">{day}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                {daySlots.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                    No classes
                  </div>
                ) : (
                  daySlots.map(slot => (
                    <div key={slot.id} className="rounded-lg border p-3 space-y-2 relative bg-card shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="font-mono text-xs">
                          {slot.startTime} - {slot.endTime}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm leading-tight mb-1">
                          {slot.teachingAssignment.subject.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          Prof. {slot.teachingAssignment.teacher.user.name}
                        </p>
                      </div>
                      {slot.room && (
                        <div className="flex items-center text-xs text-muted-foreground pt-1 border-t">
                          <MapPin className="mr-1 h-3 w-3" />
                          <span className="line-clamp-1">{slot.room}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
