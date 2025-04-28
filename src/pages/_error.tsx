function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div>
      <h1>{statusCode}</h1>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: { res?: { statusCode: number }; err?: { statusCode: number } }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default ErrorPage;