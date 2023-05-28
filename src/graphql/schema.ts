import { PrismaClient } from '@prisma/client';
import { gql } from 'apollo-server';
import { ApolloError } from 'apollo-server-errors';
import { GraphQLScalarType, Kind } from 'graphql';
import { generateDueDate } from '../util/helpers';

const prisma = new PrismaClient({});

const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
        if (typeof value === 'string') {
            return new Date(value).getTime();
        } else if (typeof value === 'number') {
            return value;
        }
        return value.getTime();
    },
    parseValue(value: any) {
        return new Date(value);
    },
    parseLiteral(aest) {
        if (aest.kind === Kind.INT) {
            return new Date(parseInt(aest.value, 10));
        }
        return null;
    },
})

export const typeDefs = gql`
  scalar DateScalar

  enum Host {
    YOUTUBE
    BANDCAMP
    SOUNDCLOUD
    OTHER
  }

  enum TrackType {
    ORIGINAL
    REMIX
    EDIT
    CLUB_MIX
    RADIO_EDIT
    BOOTLEG
  }

  type Track {
    id: ID!
    created_at: DateScalar
    title: String!
    track_type: TrackType!
    artists: [Artist!]!
    remix_artists: [Artist!]
    album: Album
    release_date: DateScalar
    image: String
    url: String!
    host: Host!
    genres: [Genre!]!
  }

  type Artist {
    id: ID!
    name: String!
    tracks: [Track!]
    remixes: [Track!]
    mixes: [Mix!]
    albums: [Album!]
  }

  type Album {
    id: ID!
    title: String!
    host: Host!
    image: String
    url: String!
    tracks: [Track!]!
  }

  type Genre {
    id: ID!
    name: String!
    tracks: [Track!]!
  }

  type Mix {
    id: ID!
    title: String!
    artist: Artist!
    host: Host!
    image: String
    url: String!
  }

  input TrackInput {
    title: String!
    track_type: TrackType!
    artists: [String!]
    remix_artists: [String!]
    album: String
    release_date: DateScalar
    image: String
    url: String!
    host: Host!
    genres: [String!]!
  }

  input AlbumInput {
    title: String!
    artist: String!
    host: Host!
    tracks: [String!]!
  }

  input MixInput {
    title: String!
    artist: String!
    host: Host
    image: String
    url: String!
  }

  type Query {
    all_tracks: [Track!]!
    all_artists: [Artist!]!
    all_albums: [Album!]!
    all_mixes: [Mix!]!
  }

  type Mutation {
    add_track(
        input: TrackInput!
    ): Track!

    add_album(
        input: AlbumInput!
    ): Album!

    add_mix(
        input: MixInput!
    ): Mix!
  }
`

export const resolvers = {
    Track: {
        artists: async (_parent: any) => {
            const track = await prisma.track.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    artists: true
                }
            })

            if (!track) {
                throw new ApolloError('Failed to find track to resolve related artists')
            }

            return track.artists
        },
        remix_artists: async (_parent: any) => {
            const track = await prisma.track.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    remix_artists: true
                }
            })

            if (!track) {
                throw new ApolloError('Failed to find track to resolve related remix artists')
            }

            return track.remix_artists
        },
        album: async (_parent: any) => {
            const track = await prisma.track.findUnique({
                where: {
                    id: _parent.id
                }
            })

            if (!track) {
                throw new ApolloError('Failed to find track to resolve related album')
            }

            const album = await prisma.album.findUnique({
                where: {
                    id: track.id
                }
            })

            return album
        },
        genres: async (_parent: any) => {
            const track = await prisma.track.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    genres: true
                }
            })


            if (!track) {
                throw new ApolloError('Failed to find track to resolve related genres')
            }

            return track.genres
        }
    },
    Artist: {
        tracks: async (_parent: any) => {
            const artist = await prisma.artist.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    tracks: true
                }
            })

            if (!artist) {
                throw new ApolloError('Failed to find artist to resolve related tracks')
            }

            return artist.tracks
        },
        remixes: async (_parent: any) => {
            const artist = await prisma.artist.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    remixes: true
                }
            })

            if (!artist) {
                throw new ApolloError('Failed to find artist to resolve related remixes')
            }

            return artist.remixes
        },
        mixes: async (_parent: any) => {
            const artist = await prisma.artist.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    mixes: true
                }
            })

            if (!artist) {
                throw new ApolloError('Failed to find artist to resolve related mixes')
            }

            return artist.mixes
        }
    },
    Album: {
        tracks: async (_parent: any) => {
            const album = await prisma.album.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    tracks: true
                }
            })

            if (!album) {
                throw new ApolloError('Failed to find album to resolve related tracks')
            }

            return album.tracks
        }
    },
    Genre: {
        tracks: async (_parent: any) => {
            const genre = await prisma.artist.findUnique({
                where: {
                    id: _parent.id
                },
                include: {
                    tracks: true
                }
            })

            if (!genre) {
                throw new ApolloError('Failed to find artist to resolve related tracks')
            }

            return genre.tracks
        }
    },
    Mix: {
        artist: async (_parent: any) => {
            const artist = await prisma.artist.findUnique({
                where: {
                    id: _parent.artist_id
                }
            })

            if (!artist) {
                throw new ApolloError('Failed to find mix artist')
            }

            return artist
        }
    },
    Query: {
        all_tracks: async (parent: any) => prisma.track.findMany(),
        all_artists: async (parent: any) => prisma.artist.findMany(),
        all_albums: async (parent: any) => prisma.album.findMany(),
        all_mixes: async (parent: any) => prisma.mix.findMany()
    },
    Mutation: {
        add_track: async (
            _parent: any,
            { input }: any
        ) => {
            console.log('received new track input: ', input);

            const {
                title,
                track_type,
                artists,
                remix_artists,
                album,
                release_date,
                image,
                url,
                host,
                genres } = input;

            const newTrack = await prisma.track.create({
                data: {
                    title,
                    track_type,
                    album,
                    release_date,
                    image,
                    url,
                    host,
                    artists: {
                        connectOrCreate: artists.map((a: string) => (
                            {
                                where: { name: a },
                                create: { name: a }
                            }
                        ))
                    },
                    remix_artists: {
                        connectOrCreate: remix_artists.map((r_a: string) => (
                            {
                                where: { name: r_a },
                                create: { name: r_a }
                            }
                        ))
                    },
                    genres: {
                        connectOrCreate: genres.map((g: string) => (
                            {
                                where: { name: g },
                                create: { name: g }
                            }
                        ))
                    },
                }
            })

            return newTrack
        },
        add_mix: async (
            _parent: any,
            { input }: any
        ) => {
            const {
                title,
                artist,
                host,
                image,
                url } = input;

            const artistExists = await prisma.artist.findFirst({
                where: {
                    name: artist
                }
            })

            if (artistExists) {
                console.log('Connecting new mix to existing artist...', artistExists)
            } else {
                console.log('Creating entry for new artist. Connecting new mix to new artist...')
            }

            const newMix = await prisma.mix.create({
                data: {
                    title,
                    host,
                    image,
                    url,
                    artist: artistExists ? {
                        connect: {
                            id: artistExists.id
                        }
                    } : {
                        create: {
                            name: artist
                        }
                    },

                }
            })

            console.log('added new mix...', newMix);

            return newMix
        }
    }
}