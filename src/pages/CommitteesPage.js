import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { useStyles, StyledTableCell, StyledTableRow } from './Styles';

const Committees = props => {
  const classes = useStyles();

  const [committees, setCommittees] = useState([]); // state to store committees
  const [loading, setLoading] = useState(false); // state to check if data is getting fetched

  // this function will set states back to their initial values in case of an error
  const setStatesBackToInitialValues = () => {
    setCommittees([]);
    setLoading(false);
  };

  useEffect(() => {
    if (
      !(
        props?.location?.data?.repoName ||
        props?.location?.data?.numOfCommittees
      )
    )
      return;

    const { repoName, numOfCommittees } = props.location.data;

    // this block of code will get the committees
    const getCommittees = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://api.github.com/repos/${repoName}/stats/contributors?anon=1`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: 'Token 119d2564831d4ebf0616a64a2d2bcbc504c6f098',
            },
          }
        );

        // console.log(res);

        // to get the data in desc order
        res.data = res.data.reverse();

        // to check if the data fetched is more than M value
        const numOfCommitteesGreterThanM = res.data.length > numOfCommittees;

        if (numOfCommitteesGreterThanM)
          res.data = res.data.slice(0, numOfCommittees);

        setCommittees(
          res.data.map((commit, ind) => {
            return { ...commit, id: ind + 1 };
          })
        );

        setLoading(false);
      } catch (err) {
        setStatesBackToInitialValues();
        console.log(err);
      }
    };
    getCommittees();
  }, []);

  return (
    <div className='committees_page'>
      <Navbar />
      <Typography
        color='error'
        style={{ marginTop: 10, fontSize: 25, margin: 'auto' }}
      >
        {loading ? 'Fetching Data' : null}
      </Typography>

      <Container>
        {committees.length > 0 && (
          <div style={{ marginTop: 40, color: 'red' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                to={{
                  pathname: `/`,
                  data: props?.location?.data || {},
                }}
              >
                <Button
                  variant='contained'
                  color='secondary'
                  style={{ marginRight: 20 }}
                >
                  Back
                </Button>
              </Link>

              <Typography variant='h5'>
                Top m committees of repo and their commit count{' '}
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
                    {committees.map(row => (
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
                            href={row?.author?.html_url}
                            rel='noopener noreferrer'
                            target='_blank'
                          >
                            {row?.author?.html_url?.substring(0, 50)}
                          </a>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Committees;
