import { useState } from "react";

import PageShell from "../../components/layout/PageShell.js";

import EmptyState from "../../shared/components/feedback/EmptyState.js";
import LoadingSpinner from "../../shared/components/feedback/LoadingSpinner.js";

import SongTable from "../../features/songs/components/SongTable.js";
import SongToolbar from "../../features/songs/components/SongToolbar.js";

import { useSongs } from "../../features/songs/hooks/useSongs.js";

export default function SongsPage() {

  const {

    songs,

    loading,

    error,

  } = useSongs();

  const [

    search,

    setSearch,

  ] = useState("");

  const [

    genre,

    setGenre,

  ] = useState("");

  const [

    status,

    setStatus,

  ] = useState("");

  if (loading) {

    return <LoadingSpinner />;

  }

  if (error) {

    return (

      <PageShell

        title="Songs"

        description="Song Library"

      >

        <EmptyState

          message={error}

        />

      </PageShell>

    );

  }

  const filteredSongs =

    songs.filter(

      song => {

        const matchesSearch =

          search === "" ||

          song.title

            .toLowerCase()

            .includes(

              search.toLowerCase(),

            );

        const matchesGenre =

          genre === "" ||

          song.genre === genre;

        const matchesStatus =

          status === "" ||

          song.status === status;

        return (

          matchesSearch &&

          matchesGenre &&

          matchesStatus

        );

      },

    );

  return (

    <PageShell

      title="Songs"

      description="Manage generated songs."

    >

      <SongToolbar

        search={search}

        genre={genre}

        status={status}

        onSearchChange={setSearch}

        onGenreChange={setGenre}

        onStatusChange={setStatus}

        onCreate={() => {

          console.log(

            "Create Song",

          );

        }}

      />

      {

        filteredSongs.length === 0

          ? (

            <EmptyState

              message="No songs found."

            />

          )

          : (

            <SongTable

              songs={filteredSongs}

            />

          )

      }

    </PageShell>

  );

}
