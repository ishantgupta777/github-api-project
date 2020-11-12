import React from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useStyles, StyledTableCell, StyledTableRow } from '../pages/Styles';

export default function RepoTable({
  repoData,
  page,
  setPage,
  numOfCommittees,
  numPages,
  loading,
  numOfRepos,
  orgName,
}) {
  const classes = useStyles();
  return (
    <div style={{ marginTop: 40, color: 'red' }}>
      <Typography variant='h5'>
        Top n repos (according to forks count)
      </Typography>
      <Typography variant='subtitle2'>
        Click on repo name to see committees
      </Typography>
      <div
        style={{
          marginTop: 20,
          color: 'black',
          width: '100%',
        }}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align='center'>Name</StyledTableCell>
                <StyledTableCell align='center'>Forks</StyledTableCell>
                <StyledTableCell align='center'>Commit Count</StyledTableCell>
                <StyledTableCell align='center'>URL</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repoData.map(row => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component='th' scope='row'>
                    {row.id}
                  </StyledTableCell>
                  <Link
                    to={{
                      pathname: `/committees/${row.full_name}`,
                      data: {
                        numOfRepos,
                        orgName,
                        numOfCommittees,
                        repoName: row.full_name,
                      },
                    }}
                  >
                    <StyledTableCell align='center' style={{ color: 'red' }}>
                      {row.full_name}
                    </StyledTableCell>
                  </Link>
                  <StyledTableCell align='center'>{row.forks}</StyledTableCell>
                  <StyledTableCell align='center'>
                    {row.totalCommits}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    <a
                      href={row.html_url}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      {row.html_url}
                    </a>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Typography color='error' style={{ marginTop: 10 }}>
        {loading ? 'Fetching Data' : null}
      </Typography>
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 50,
        }}
      >
        {page < numPages && (
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setPage(page + 1);
            }}
            style={{ marginRight: 20 }}
          >
            Next
          </Button>
        )}
        {page > 1 && (
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setPage(page - 1);
            }}
            style={{ marginLeft: 20 }}
          >
            Prev
          </Button>
        )}
      </div>
    </div>
  );
}
