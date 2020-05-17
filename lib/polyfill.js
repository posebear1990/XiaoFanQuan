if (!Promise.allSettled) {
  Promise.allSettled = (promises) =>
    Promise.all(
      promises.map((promise, i) =>
        promise.then((value) => value).catch((reason) => reason)
      )
    );
}
