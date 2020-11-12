import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  makeStyles,
  withStyles,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { useStyles, StyledTableCell, StyledTableRow } from './Styles';

const CommitsPage = props => {
  const classes = useStyles();

  const [commits, setCommits] = useState([]); // state to store commits
  const [page, setPage] = useState(1); // state to store current page num
  const [loading, setLoading] = useState(false); // state to check if data is getting fetched
  const [numPages, setNumPages] = useState(1); // state to store max num of pages

  // this function will set states back to their initial values in case of an error
  const setStatesBackToInitialValues = () => {
    setCommits([]);
    setPage(1);
    setNumPages(1);
    setLoading(false);
  };

  useEffect(() => {
    if (
      !(props?.location?.data?.repoName || props?.location?.data?.numOfCommits)
    )
      return;

    const { repoName, numOfCommits } = props.location.data;

    // this block of code will set the max num of pages
    setNumPages(
      Math.min(
        Math.ceil(props.location.data.totalCommits / 100),
        Math.ceil(numOfCommits / 100)
      )
    );

    // this block of code will get the commits
    const getCommits = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://api.github.com/repos/${repoName}/stats/contributors?direction=desc&per_page=100&page=${page}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
            },
          }
        );

        // console.log(res);

        // to check if the data fetched is more than M value
        const numOfCommitssGreterThanM =
          100 * (page - 1) + res.data.length > numOfCommits;

        if (numOfCommitssGreterThanM)
          res.data = res.data.slice(0, numOfCommits % 100);

        setCommits(
          res.data.reverse().map((commit, ind) => {
            return { ...commit, id: 100 * (page - 1) + ind + 1 };
          })
        );

        setLoading(false);
      } catch (err) {
        setStatesBackToInitialValues();
        console.log(err);
      }
    };
    getCommits();
  }, [page]);

  return (
    <div className='commits_page'>
      <Navbar />
      <Typography color='error' style={{ marginTop: 10 }}>
        {loading ? 'Fetching Data' : null}
      </Typography>
      <Container>
        {commits.length > 0 && (
          <div style={{ marginTop: 40, color: 'red' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to='/'>
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ marginRight: 20 }}
                >
                  Back
                </Button>
              </Link>
              <Typography variant='h5'>
                Top m ({props?.location?.data?.numOfCommits}) commiterss of repo
                and their commit count
                {props?.location?.data?.repoName || ''}
              </Typography>
            </div>
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
                      <StyledTableCell align='center'>
                        Committer
                      </StyledTableCell>
                      <StyledTableCell align='center'>
                        Commit Count
                      </StyledTableCell>
                      <StyledTableCell align='center'>
                        GitHub Profile Link
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commits.map(row => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component='th' scope='row'>
                          {row.id}
                        </StyledTableCell>
                        <StyledTableCell
                          align='center'
                          style={{ color: 'red' }}
                        >
                          {row?.author?.login || null}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          {row?.total || -1}
                        </StyledTableCell>
                        <StyledTableCell align='center'>
                          <a
                            href={row.html_url}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {/* {row.html_url.substring(0, 50)} */}
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
              {/* {page < numPages && (
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
              )} */}
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
        )}
      </Container>
    </div>
  );
};

export default CommitsPage;
