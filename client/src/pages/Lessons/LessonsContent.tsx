import { useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import { TableHeader } from './LessonTableHeader';
import { useFetch } from '../../shared/hooks/useFetch';
import { useAppSelector } from '../../shared/hooks/useAppSelector';
import { ILessonModel } from '../../shared/models/ILessonModes';

interface ILessons {
  message: string;
  payload: Array<ILessonModel>;
}

function getDayName(day: number) {
  const dayNames: { [code: number]: string } = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
  };
  return dayNames[day];
}

function createRow(id: string, args: (string | number | JSX.Element)[]) {
  return (
    <TableRow>
      { args.map((value) => <TableCell key={id + value}>{value}</TableCell>) }
    </TableRow>
  );
}

function getArgumentsFromLesson(lesson: ILessonModel, isMobile: boolean) {
  if (isMobile) {
    return [lesson.title, lesson.activeStudents];
  }

  return ([
    lesson.title,
    getDayName(lesson.day),
    'Группа',
    lesson.activeStudents,
    lesson.isActive ? 'Активна' : 'В архиве',
    <IconButton><DeleteIcon /></IconButton>,
  ]);
}

export function LessonsContent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [page, setPage] = useState(0);
  const [rowsNumber, setRowsNumbr] = useState(10);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, error } = useFetch<ILessons>({ url: '/lesson' });
  const lessonSelector = useAppSelector((state) => state.lessonPageReduer);

  if (isLoading || !data?.payload) {
    return null;
  }

  if (error) {
    return <h1>Error!!! </h1>;
  }

  const { lessonSizeFilter, lessonActiveStatusFilter, lessonTitleFilter } = lessonSelector;

  const filteredData = data.payload.filter((lesson) => {
    const activeFilter = lessonActiveStatusFilter === 'active';
    return lesson.isActive === activeFilter
      && lesson.title.toLowerCase().includes(lessonTitleFilter.toLocaleLowerCase())
      && lessonSizeFilter;
  });

  const filteredRows = filteredData.map((lesson) => {
    const args = getArgumentsFromLesson(lesson, isMobile);
    return createRow(lesson._id, args);
  });

  const rowsStartIdx = page === 0 ? 0 : page * rowsNumber;
  const rowsEndIdx = page === 0 ? rowsNumber : (page + 1) * rowsNumber;

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableHeader
              sortable={new Set(['day', 'activeStudents'])}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </TableHead>
          <TableBody>
            { filteredRows.slice(rowsStartIdx, rowsEndIdx) }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component='div'
        labelRowsPerPage={ isMobile ? 'Строк' : 'Показать строк' }
        rowsPerPage={rowsNumber}
        rowsPerPageOptions={[5, 10, 20]}
        count={filteredRows.length}
        page={page}
        backIconButtonProps={{
          disabled: page === 0,
        }}
        onPageChange={(event, pageNum) => setPage(pageNum)}
        onRowsPerPageChange={(event) => {
          setRowsNumbr(+event.target.value);
          setPage(0);
        }}
        sx={{
          display: 'inline-block',
          alignSelf: isMobile ? 'center' : 'right',
        }}
      />
    </>
  );
}
