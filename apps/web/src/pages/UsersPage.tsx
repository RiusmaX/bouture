import { roleLabels } from '@bouture/shared';
import { useUsers } from '@/api/users';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

// Écran réservé aux administrateurs (route gardée dans App.tsx, et l'API refuse les autres)
export function UsersPage() {
  useDocumentTitle('Utilisateurs');
  const { data, isPending, error } = useUsers();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-primary">Utilisateurs</h1>
      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Rôle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{roleLabels[user.role]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
