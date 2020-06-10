import React, { lazy, Suspense } from 'react';
import { Switch, Route, withRouter, useRouteMatch } from 'react-router';

import Spinner from './../../components/spinner/spinner';

const ExploreFeed = lazy(() => import('./../../pages/explore/explore-feed'));
const CategoryOverview = lazy(() =>
  import('./../../components/category/category-overview')
);

const Explore = ({ history }) => {
  let { path } = useRouteMatch();

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route
          exact
          path={`${path}/:category/:genre`}
          component={ExploreFeed}
          history={history}
        />
        <Route
          exact
          path={`${path}/:category`}
          component={CategoryOverview}
          history={history}
        />
        <Route path={path} component={CategoryOverview} />
      </Switch>
    </Suspense>
  );
};

export default withRouter(Explore);
