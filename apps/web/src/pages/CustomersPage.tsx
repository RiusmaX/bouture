import { useState } from 'react';
import { Link } from 'react-router';
import { PlusIcon } from 'lucide-react';
import { customerTypeLabels, customerTypes, type CustomerType } from '@bouture/shared';
import { useCustomers } from '@/api/customers';
import { Pagination } from '@/components/Pagination';
import { ErrorMessage, Loading } from '@/components/QueryState';
import { SearchInput } from '@/components/SearchInput';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const ALL = 'all';

export function CustomersPage() {
  useDocumentTitle('Clients');
  const [search, setSearch] = useState('');
  const [type, setType] = useState<CustomerType | ''>('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const { data, isPending, error } = useCustomers({
    search: debouncedSearch || undefined,
    type: type || undefined,
    page,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Clients</h1>
        <Button asChild>
          <Link to="/customers/new">
            <PlusIcon aria-hidden /> Nouveau client
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <Select
          value={type || ALL}
          onValueChange={(value) => {
            setType(value === ALL ? '' : (value as CustomerType));
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Type de client" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous les clients</SelectItem>
            {customerTypes.map((value) => (
              <SelectItem key={value} value={value}>
                {customerTypeLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isPending ? (
        <Loading />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Téléphone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="font-medium text-primary hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{customerTypeLabels[customer.type]}</Badge>
                  </TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone ?? '·'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
